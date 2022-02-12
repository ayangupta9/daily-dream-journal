module.exports = class TextAnalysis {
  constructor (rawResult) {
    this._text_characters = rawResult.usage.text_characters
    this._keywords = rawResult.keywords
    this._sentiment = rawResult.sentiment.document
    this._sentenceSentiment = rawResult.sentenceSentiment
    this._entities = rawResult.entities.map(entity => {
      return {
        type: entity.type,
        text: entity.text,
        sentiment: entity.sentiment,
        emotion: entity.emotion,
        relevance: entity.relevance,
        confidence: entity.confidence
      }
    })
    this._emotion = rawResult.emotion.document.emotion
    this._categories = rawResult.categories
  }

  get text_characters () {
    return this._text_characters
  }
  get keywords () {
    return this._keywords
  }
  get sentiment () {
    return this._sentiment
  }
  get sentenceSentiment () {
    return this._sentenceSentiment
  }
  get entities () {
    return this._entities
  }
  get emotion () {
    return this._emotion
  }
  // get concepts () {
  //   return this._concepts
  // }
  get categories () {
    return this._categories
  }

  get finalStringFormat () {
    const resultString = JSON.stringify(this)
    return resultString
  }
}
