function renderChoice(renderer, {output}, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === 'prompt');
  const choices = output.find(chunk => chunk.name === 'choices');
  const defaultChoice = output.find(chunk => chunk.name === 'defaultChoice');

  return renderer('auth/callbacks/choice.njk', {
    callbackIndex,
    prompt: prompt.value,
    choices: choices.value,
    defaultChoice: defaultChoice.value,
  });
}

exports.renderCallbacks = function renderCallbacks(renderer, callbacks) {
  return callbacks.map((callback, i) => {
    switch (callback.type) {
      case 'ChoiceCallback':
        return renderChoice(renderer, callback, i);
      default:
        throw new Error('unknown callback type');
    }
  });
};

exports.extractRedirect = function extractRedirect(callbacks) {
  const redirectCallback = callbacks.find(callback => callback.type === 'RedirectCallback');
  if (!redirectCallback) return null;

  const url = redirectCallback.output.find(chunk => chunk.name === 'redirectUrl');
  return {
    url: url.value,
  };
};
