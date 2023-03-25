const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest');
  },
  handle(handlerInput) {
    const speakOutput = 'Welcome, you can say "play audio" to start listening to music. What would you like to do?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

/**
 * Intent handler to start playing an audio file.
 * By default, it will play a specific audio stream.
 * */
const PlayAudioIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayAudioIntent') ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent')
      )
    );
  },
  handle(handlerInput) {
    const speakOutput    = 'Playing the audio stream.';
    const playBehavior   = 'REPLACE_ALL';

    // https://requestbin.com/
    // https://requestbin.com/r
    // https://requestbin.com/r/en0m33feca4osq
    const audioStreamUrl = 'https://en0m33feca4osq.x.pipedream.net/audio_track.mp3';

    const response = handlerInput.responseBuilder
      .speak(speakOutput)
      .addAudioPlayerPlayDirective(
        playBehavior,
        audioStreamUrl,
        'mytoken',
        0
      )
      .getResponse();

    if (response.directives) {
      response.directives.forEach(directive => {
        if (directive.type === 'AudioPlayer.Play') {
          directive.audioItem.stream.httpHeaders = {
            "all": [{
              "name":  "X-Alexa-Issue",
              "value": "https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/issues/610#issuecomment-1483729767"
            }]
          }
        }
      })
    }

    return response;
  }
};

/**
 * Intent handler to start playing an audio file.
 * By default, it will play a specific audio stream.
 * */
const PauseAudioIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

/**
 * Intent handler for built-in intents that aren't supported in this sample skill.
 * As this is a sample skill for a single stream, these intents are irrelevant to this skill.
 * Regardless, the skill needs to handle this gracefully, which is why this handler exists.
 * */
const UnsupportedAudioIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOffIntent')    ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.LoopOnIntent')     ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent')       ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent')   ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent')     ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOffIntent') ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ShuffleOnIntent')  ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StartOverIntent')
      )
    );
  },
  handle(handlerInput) {
    const speakOutput = 'Sorry, I can\'t support that yet.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent')
    );
  },
  handle(handlerInput) {
    const speakOutput = 'You can say "play audio" to start playing music! How can I help?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent') ||
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
      )
    );
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

/* *
 * SystemExceptions can be triggered if there is a problem with the audio that is trying to be played.
 * This handler will log the details of the exception and can help troubleshoot issues with audio playback.
 * */
const SystemExceptionHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered');
  },
  handle(handlerInput) {
    console.log(`System exception encountered: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
  },
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent')
    );
  },
  handle(handlerInput) {
    const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest');
  },
  handle(handlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayAudioIntentHandler,
    PauseAudioIntentHandler,
    UnsupportedAudioIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SystemExceptionHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(
    ErrorHandler
  )
  .lambda();
