// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var row = $("<div>");
    row.addClass("row");

    var textCol = $("<div>");
    textCol.addClass("col-lg-6");

    var articleTitle = $("<h3>");
    articleTitle.text(data[i].title);

    var articleDescription = $("<p>");
    articleDescription.text(data[i].description);

    var buttonCol = $("<div>");
    buttonCol.addClass("col-lg-6");

    var noteButton = $("<button>");
    noteButton.addClass("btn btn primary noteButton");
    noteButton.attr("id", data[i]._id);
    noteButton.text("Note");

    var linkButton = $("<a>");
    linkButton.attr(
      "href",
      "https://www.nytimes.com" +
        data[i].link +
        "?action=click&module=Top%20Stories&pgtype=Homepage"
    );
    linkButton.attr("target", "_blank");
    linkButton.text("Link");
    linkButton.addClass("btn btn-primary");

    var buttonDiv = $("<div>");
    buttonDiv.addClass("buttons");
    buttonDiv.append(noteButton, linkButton);

    textCol.append(articleTitle, articleDescription);
    buttonCol.append(buttonDiv);
    row.append(textCol, buttonCol);
    $("#articles").append(row);
  }
});

// Whenever someone clicks a p tag
$(document).on("click", ".noteButton", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button class = 'btn btn-primary saveNote' data-id='" +
          data._id +
          "' id='savenote'>Save Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
