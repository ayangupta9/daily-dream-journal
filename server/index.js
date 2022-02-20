const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const formidable = require('formidable')
const User = require('./models/User')
const { MongoClient, ObjectId } = require('mongodb')
const {
  uploadBlobToStorage,
  downloadBlobsFromStorage,
  downloadSingleBlobFromStorage
} = require('./controller/blobUpload')
const {
  finalAnalysis
} = require('./controller/text-analytics/cummulativeTextAnalysis')
const path = require('path')
require('dotenv').config()

const PORT = process.env.PORT || 8080
const app = express()

app.set('port', PORT)
app.use(express.json())
app.set(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static(path.join(__dirname, '../client/build')))

const uri = process.env.COSMOSDB_MONGODB_URI

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.post('/getUser', (req, res) => {
  profileId = ObjectId(req.body.id)

  client.connect(async (err, db) => {
    if (err) {
      res.status(404).json({
        message: 'Some error occured'
      })
      return
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    const result = await userCollection.findOne({ _id: profileId })

    if (result) {
      delete result['hash']

      res.status(200).json({
        message: 'New data found',
        currentUser: result
      })
    } else {
      res.status(401).json({
        message: 'User does not exist'
      })
    }
  })
})

app.post('/signup', (req, res) => {
  const user = req.body

  client.connect(async (err, db) => {
    if (err) {
      db.close()

      return
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    const result = await userCollection.findOne({ email: user.email })
    if (result !== null) {
      res.json({
        code: 401,
        message: 'User already exists'
      })
    } else {
      const saltRounds = 10
      const hashResult = await bcrypt.hash(user.password, saltRounds)
      //

      const newUser = new User({
        username: user.username,
        email: user.email,
        bio: 'I am a dreamer',
        hash: hashResult
      })

      const result = await userCollection.insertOne(newUser)

      if (result === null) {
        res.json({
          code: 404,
          message: 'Error! Try again'
        })
        return
      } else {
        //
        res.json({
          code: 200,
          message: 'Sign Up successful'
        })
      }
    }

    db.close()
  })
})

app.post('/login', (req, res) => {
  const user = req.body

  client.connect(async (err, db) => {
    if (err) {
      db.close()

      return
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    const result = await userCollection.findOne({ email: user.email })

    if (result === null) {
      res.json({
        code: 401,
        message: 'User does not exist. Please sign in'
      })
    } else {
      const isPasswordValid = await bcrypt.compare(user.password, result.hash)

      if (isPasswordValid) {
        const currentUser = result

        res.json({
          code: 200,
          message: 'Successfully Logged In',
          currentUser: currentUser
        })
      } else {
        res.json({
          code: 403,
          message: 'Invalid Password'
        })
      }
    }

    db.close()
  })
})

// app.post('/createentry', (req, res) => {
app.post('/createentry', async (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
    }

    const entry = fields
    const searchKey = ObjectId(entry.profileId)

    client.connect(async (err, db) => {
      if (err) {
        db.close()

        return
      }

      const mainDatabase = db.db('ddjcluster')
      const userCollection = mainDatabase.collection('users')

      const result = await userCollection.findOne({ _id: searchKey })
      if (result) {
        //

        const entryId = crypto.randomBytes(20).toString('hex')
        entry.entryId = entryId

        const entryTimestamp = new Date(parseInt(entry.timestamp))
        // DATES UPDATION

        let newDates = result.dates

        const entriesYear = entryTimestamp.getFullYear().toString()
        const entriesDate = entryTimestamp.getDate().toString()
        const entriesMonth = (entryTimestamp.getMonth() + 1).toString()

        const formattedDate = `${entriesYear}/${entriesMonth}/${entriesDate}`

        if (result.dates.hasOwnProperty(entriesYear)) {
          let items = result.dates[entriesYear].items
          let newItems = result.dates[entriesYear].items
          items.map((item, index) => {
            if (item.date === formattedDate) {
              const newitem = {
                index: item.index,
                date: item.date,
                count: item.count + 1
              }

              newItems[index] = newitem
            } else {
              const newitem = {
                index: items[items.length - 1].index + 1,
                date: formattedDate,
                count: 1
              }
              newItems.push(newitem)
            }

            newDates[entriesYear].items = newItems
          })
        } else {
          const newYearEntry = {
            dateRange: {
              startDate: `${entriesYear}-01-01`,
              endDate: `${entriesYear}-12-31`
            },
            items: [
              {
                index: 1,
                date: formattedDate,
                count: 1
              }
            ]
          }
          newDates[entriesYear] = newYearEntry
        }

        // TEXT ANALYSIS RESULT

        if ('entrycontent' in entry) {
          const textAnalysisResult = await finalAnalysis(entry.entrycontent)

          entry.textAnalysis = textAnalysisResult
        }

        // ENTRIES UPDATION

        if (Object.keys(files).length !== 0) {
          await uploadBlobToStorage(files, entry.profileId, entry.entryId)
        }

        const updationResult = await userCollection.findOneAndUpdate(
          {
            _id: searchKey
          },
          {
            $set: {
              dates: newDates
            },
            $push: {
              entries: entry
            }
          },
          { returnDocument: 'after' }
        )

        let docAfterChange = updationResult.value
        delete docAfterChange['hash']

        res.json({
          code: 200,
          message: 'Dream entry successfully recorded',
          entryId: entryId,
          newCurrentUser: docAfterChange
        })
      } else {
        res.json({
          code: 404,
          message: 'No user found. Cannot record entry'
        })
      }
    })
  })
})

async function sendResetEmail (host, token, email) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  const data = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Account password reset',
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' +
      host +
      '/reset-password/' +
      token.toString('hex') +
      '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.Please click on the following link, or paste this into your browser to complete the process:</p>
    <a href="http://${host}/reset-password/${token.toString(
      'hex'
    )}">Reset password link</a><br/><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
  }

  sgMail.setApiKey(SENDGRID_API_KEY)
  await sgMail.send(data)
}

app.post('/forgot', (req, res) => {
  const email = req.body.forgotpassemail

  client.connect(async (err, db) => {
    if (err) {
      db.close()

      return
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    userCollection.findOne({ email: email }, async (err, user) => {
      if (user) {
        const token = crypto.randomBytes(20)

        const result = await userCollection.updateOne(
          { email: email },
          {
            $set: {
              resetPasswordToken: token.toString('hex'),
              resetPasswordExpires: Date.now() + 3600000
            }
          }
        )

        //

        await sendResetEmail(req.headers.host, token.toString('hex'), email)

        res.json({
          code: 200,
          message: 'Password reset email sent to the mentioned address'
          // redirect: '/reset-password'
        })
      } else {
        res.json({
          code: 404,
          message: 'User does not exist'
        })
      }
    })
  })
})

app.get('/reset/:token', (req, res) => {
  const token = req.params.token

  client.connect((err, db) => {
    if (err) {
      db.close()
      throw err
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    userCollection.findOne(
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      async function (err, user) {
        if (err) {
          db.close()
          throw err
        }

        if (!user) {
          res.json({
            code: 404,
            message: 'Password reset token is invalid or has expired',
            display: false,
            navigate: '/forgot-password'
          })
          return
        }

        res.json({
          code: 200,
          display: true
        })
      }
    )
  })
})

app.post('/reset/:token', (req, res) => {
  const token = req.params.token

  client.connect((err, db) => {
    if (err) {
      db.close()
      throw err
    }

    const mainDatabase = db.db('ddjcluster')
    const userCollection = mainDatabase.collection('users')

    userCollection.findOne(
      {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      async (err, user) => {
        if (err) {
          db.close()
          throw err
        }

        //

        const newPassword = req.body.newPassword
        const saltRounds = 10
        const hashResult = await bcrypt.hash(newPassword, saltRounds)

        const result = await userCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              hash: hashResult,
              resetPasswordToken: null,
              resetPasswordExpires: null
            }
          }
        )

        res.json({
          code: 200,
          message: `Password changed. Let's log you in`
        })
      }
    )
  })
})

app.post('/changeBio', (req, res) => {
  const user_id = ObjectId(req.body.id)
  const newBio = req.body.newBio

  //

  client.connect(async (err, db) => {
    if (err) {
      db.close()
      throw err
    }

    mainDatabase = db.db('ddjcluster')
    userCollection = mainDatabase.collection('users')

    const result = await userCollection.updateOne(
      { _id: user_id },
      {
        $set: {
          bio: newBio
        }
      }
    )

    //

    if (result.matchedCount !== 0) {
      res.json({
        code: 200,
        message: `User bio changed`,
        cssClass: 'error'
      })
    } else {
      res.json({
        code: 404,
        message: `User bio not changed`,
        cssClass: 'success'
      })
    }
  })
})

app.post('/allImages', async (req, res) => {
  const profileId = req.body.profileId

  const downloadedImages = await downloadBlobsFromStorage(profileId)

  //

  if (downloadedImages) {
    res.json({
      code: 200,
      allImages: downloadedImages
    })
  } else {
    res.json({
      code: 404,
      message: 'Could not download images. Try again'
    })
  }
})

app.post('/singleImage', async (req, res) => {
  const profileId = req.body.profileId
  const entryId = req.body.entryId

  const downloadedImage = await downloadSingleBlobFromStorage(
    profileId,
    entryId
  )

  if (downloadedImage !== false) {
    res.json({
      code: 200,
      imageBase64: downloadedImage
    })
  } else {
    res.json({
      code: 404,
      message: 'Could not download image. Try again'
    })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.listen(PORT, async () => {})
