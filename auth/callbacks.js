const _ = require("lodash");
const templateMappings = require("./page-template-mappings");

function renderChoiceCallback(renderer, { output }, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === "prompt");
  const choices = output.find(chunk => chunk.name === "choices");
  const defaultChoice = output.find(chunk => chunk.name === "defaultChoice");

  return renderer("auth/callbacks/choice.njk", {
    callbackIndex,
    prompt: prompt.value,
    choices: choices.value,
    defaultChoice: defaultChoice.value
  });
}

function renderNameCallback(renderer, { output }, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === "prompt");

  return renderer("auth/callbacks/name.njk", {
    callbackIndex,
    prompt: prompt.value
  });
}

function renderPasswordCallback(renderer, { output }, callbackIndex) {
  const prompt = output.find(chunk => chunk.name === "prompt");

  return renderer("auth/callbacks/password.njk", {
    callbackIndex,
    prompt: prompt.value
  });
}

exports.renderCallbacks = function renderCallbacks(renderer, callbacks) {
  let c = callbacks
    .filter(callback => callback.type !== "MetadataCallback")
    .map((callback, i) => {
      switch (callback.type) {
        case "ChoiceCallback":
          return renderChoiceCallback(renderer, callback, i);
        case "NameCallback":
          return renderNameCallback(renderer, callback, i);
        case "PasswordCallback":
          return renderPasswordCallback(renderer, callback, i);
        default:
          console.log("unknown callback", callback);
          throw new Error("unknown callback type");
      }
    });
  return c;
};

exports.extractRedirect = function extractRedirect(callbacks) {
  const redirectCallback = callbacks.find(
    callback => callback.type === "RedirectCallback"
  );
  if (!redirectCallback) return null;

  const url = redirectCallback.output.find(
    chunk => chunk.name === "redirectUrl"
  );
  return {
    url: url.value
  };
};

exports.extractTemplateId = function(callbacks) {
  const metadataCallback = callbacks.find(
    callback => callback.type === "MetadataCallback"
  );
  if (!metadataCallback) {
    return "page-templates/default.njk";
  }
  const templateId = _.get(
    metadataCallback,
    "output[0].value.template_id",
    "NO_TEMPLATE_FOUND"
  );
  return _.get(templateMappings, templateId, "page-templates/default.njk");
};

exports.getQrImage = function(callbacks) {
  const metadataCallback = callbacks.find(
    callback => callback.type === "MetadataCallback"
  );
  if (!metadataCallback) {
    return null;
  }
  return _.get(metadataCallback, "output[0].value.qrimage", null);
};
