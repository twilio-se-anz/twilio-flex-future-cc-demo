const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const openResponsesJSON = Runtime.getAssets()['/features/conversation-cards/responses.json'].open;
    const responsesJSON = JSON.parse(openResponsesJSON());

    let cards = [];

    responsesJSON.forEach((response) => {
      if (!response.file) return;
      console.log('Opening response.file = ', response.file);

      const openCardDefinitionJSON =
        Runtime.getAssets()['/features/conversation-cards/definitions/' + response.file].open;

      cards.push({
        ...response,
        data: JSON.parse(openCardDefinitionJSON()),
      });
    });

    response.setStatusCode(200);
    response.setBody({ data: cards });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
