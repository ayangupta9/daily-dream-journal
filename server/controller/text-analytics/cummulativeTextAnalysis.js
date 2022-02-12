const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
const { IamAuthenticator } = require('ibm-watson/auth')
const TextAnalysis = require('../../models/TextAnalysis')
const {
  TextAnalyticsClient,
  AzureKeyCredential
} = require('@azure/ai-text-analytics')
const fs = require('fs')
require('dotenv').config()

const ibm_watson_config = {
  apikey: process.env.IBM_WATSON_CONFIG_APIKEY,
  iam_apikey_description: process.env.IBM_WATSON_CONFIG_IAM_APIKEY_DESCRIPTION,
  iam_apikey_name: process.env.IBM_WATSON_CONFIG_IAM_APIKEY_NAME,
  iam_role_crn: process.env.IBM_WATSON_CONFIG_IAM_ROLE_CRN,
  iam_serviceid_crn: process.env.IBM_WATSON_CONFIG_IAM_SERVICEID_CRN,
  url: process.env.IBM_WATSON_CONFIG_URL
}

const endpoint = process.env.AZURE_ANALYSIS_ENDPOINT
const apiKey = process.env.AZURE_ANALYSIS_APIKEY
const azureTextAnalyticsClient = new TextAnalyticsClient(
  endpoint,
  new AzureKeyCredential(apiKey)
)

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: process.env.IBM_WATSON_CONFIG_VERSION,
  authenticator: new IamAuthenticator({
    apikey: ibm_watson_config.apikey
  }),
  serviceUrl: ibm_watson_config.url
})

function formatResult (results) {
  const finalResult = {
    results: results.sentiment,
    confidenceScores: results.confidenceScores,
    sentences: results.sentences.map(sentence => {
      return {
        confidenceScores: [
          sentence.confidenceScores.positive,
          sentence.confidenceScores.neutral,
          sentence.confidenceScores.negative
        ],
        text: sentence.text,
        sentiment: sentence.sentiment
      }
    })
  }
  return finalResult
}

async function azureAnalysis (text) {
  const documents = [
    {
      text: text,
      id: '0',
      language: 'en'
    }
  ]

  const sentimentResults = await azureTextAnalyticsClient.analyzeSentiment(
    documents
  )
  const finalResults = formatResult(sentimentResults[0])
  return finalResults
}

async function ibmWatsonAnalysis (text) {
  const analyzeParams = {
    text: text,
    features: {
      categories: {},
      emotion: {},
      entities: {
        sentiment: true,
        emotion: true
      },
      keywords: {},
      sentiment: {}
    }
  }

  const models = await naturalLanguageUnderstanding.analyze(analyzeParams)
  results = models.result

  return results
}

async function finalAnalysis (text) {
  const ibmAnaltyicsResult = await ibmWatsonAnalysis(text)
  const azureAnalyticsResult = await azureAnalysis(text)

  const finalResults = {
    ...ibmAnaltyicsResult,
    sentenceSentiment: azureAnalyticsResult
  }

  const analysisResults = new TextAnalysis(finalResults)

  return analysisResults.finalStringFormat
}

module.exports = {
  finalAnalysis
}
