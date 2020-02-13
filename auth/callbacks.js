function renderChoiceCallback(renderer, {output}, callbackIndex) {
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

function renderNameCallback(renderer, {output}, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === 'prompt');

  return renderer('auth/callbacks/name.njk', {
    callbackIndex,
    prompt: prompt.value,
  });
}

function renderPasswordCallback(renderer, {output}, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === 'prompt');

  return renderer('auth/callbacks/password.njk', {
    callbackIndex,
    prompt: prompt.value,
  });
}

exports.renderCallbacks = function renderCallbacks(renderer, callbacks) {
  return callbacks.map((callback, i) => {
    switch (callback.type) {
      case 'ChoiceCallback':
        return renderChoiceCallback(renderer, callback, i);
      case 'NameCallback':
        return renderNameCallback(renderer, callback, i);
      case 'PasswordCallback':
        return renderPasswordCallback(renderer, callback, i);
      case 'TextOutputCallback':
        return renderNameCallback(renderer, callback, i);
      default:
        console.log('unknown callback', callback);
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
