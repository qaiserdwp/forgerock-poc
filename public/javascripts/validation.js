$.validator.setDefaults({
  showErrors: function(errorMap, errorList) {
    $(".govuk-error-summary__list").empty();

    $(".govuk-form-group--error")
      .find(".govuk-input--error")
      .removeClass("govuk-input--error");

    $(".govuk-form-group--error")
      .find(".govuk-error-message")
      .remove();

    $(".govuk-form-group--error").removeClass("govuk-form-group--error");

    $.each(errorList, function(index, error) {
      $(".govuk-error-summary").show();
      $(".govuk-error-summary__list").append(
        "<li><a href='#" + error.element.id + "'>" + error.message + "</a></li>"
      );
      $(error.element)
        .closest(".govuk-form-group")
        .addClass("govuk-form-group--error");
      $(error.element).addClass("govuk-input--error");
      if ($(error.element).is(":radio")) {
        $(error.element)
          .closest(".form-group")
          .find("legend")
          .append('<span class="error-message">' + error.message + "</span>");
      } else {
        $(error.element)
          .siblings("label")
          .append(
            '<span id="name-error" class="govuk-error-message"><span>' +
              error.message +
              "</span></span>"
          );
      }
    });
    if (errorList.length === 0) {
      $(".govuk-error-summary__list").hide();
    }
  }
});
