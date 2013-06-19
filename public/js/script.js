$(function() {
  
  //
  // Subscribe Form
  //
  
  $('.jserror').hide(); // hide errors
  
  $('#subscribe-submit').click(function(e) {
    
    $('.jserror').hide(); // hide previous errors
    
    var email = $("input#email").val(); // set username to variable
    
    // validate input
    if (email == "") {
      $("label#email_error").show();
      $("input#email").focus();
      return false;
    }
    
    // setup datastring
    var dataString = 'email='+ email;
    
    // post the form using ajax
    $.ajax({  
      type: "POST",  
      url: "/new-subscriber",  
      data: dataString,  
      success: function() {  
        $('#subscribe-form').html("<div id='message'></div>");  
        $('#message').html("<h2>Great! You're on the list.</h2>")  
        .append("<p>We'll let you know when jobs are posted. You can always unsubscribe at <a href='/unsubscribe'> hackersandhustlers.org/unsubscribe</a></p>");
        _kmq.push(['record', 'Subscribed']);
      }
    });
    
    return false;
  });
  
  
  //
  // Unsubscribe Form
  //
  
  $('#unsubscribe-submit').click(function(e) {
    $('.jserror').hide(); // hide previous errors
    
    var email = $("input#unsub-email").val(); // set username to variable
    
    // validate input
    if (email == "") {
      $("label#name_error").show();
      $("input#unsub_email").focus();
      return false;
    }
    
    // setup datastring
    var dataString = 'email='+ email;
    
    // post the form using ajax
    $.ajax({  
      type: "POST",  
      url: "/unsubscribe",  
      data: dataString,  
      success: function() {  
        $('#unsubscribe-form').html("<div id='message'></div>");  
        $('#message').html("<h2>You're off the list.</h2>")  
        .append("<p>We won't email you anymore.</p>");
        _kmq.push(['record', 'Unsubscribed']);
      }
    });
    
    return false;
  });
  
  
  //
  // Create Job Form
  //
  
  $('.jserror').hide(); // hide errors
  
  $('#create-job-submit').click(function(e) {
    
    $('.jserror').hide(); // hide previous errors
    
    var position = escape($("input#position").val());
    var job_type = escape($("input.job_type:checked").val());
    var company = escape($("input#company").val());
    var url = escape($("input#url").val());
    var email = escape($("input#email").val());
    var description = $("textarea#description").val();
    
    // validate position input
    if (position == "") {
      $("#position_error").show();
      $('#position_error').parent().parent().addClass('error');
      $("input#position").focus();
      return false;
    }
    
    // validate job_type input
    if (job_type == undefined) {
      $("#jobtype_error").show();
      $("#jobtype_error").parent().parent().addClass('error');
      return false;
    }
    
    // validate company input
    if (company == "") {
      $("#company_error").show();
      $("#company_error").parent().parent().addClass('error');
      $("input#company").focus();
      return false;
    }
    // validate url input
    if (url == "") {
      $("#url_error").show();
      $("#url_error").parent().parent().addClass('error');
      $("input#url").focus();
      return false;
    }
    // validate email input
    if (email == "") {
      $("#email_error").show();
      $("#email_error").parent().parent().addClass('error');
      $("input#email").focus();
      return false;
    }
    // validate description input
    if (description == "") {
      $("#description_error").show();
      $("#description_error").parent().parent().addClass('error');
      $("input#description").focus();
      return false;
    }
    
    // setup datastring
    // var dataString = 'position='+ position + '&job_type=' + job_type + '&company=' + company + '&url=' + url + '&email=' + email + '&description=' + description;
    
    // post the form using ajax
//    $.ajax({  
//      type: "POST",  
//      url: "/create-job",  
//      data: dataString,  
//      success: function() {  
//        $('#create-job-form').html("<div id='message'></div>");  
//        $('#message').html("<h2>Job Posted!</h2>")  
//        .append("<p>We'll review it and get back to you as soon as possible. If you've got any questions, just email <a href='mailto:nbashaw@gmail.com'>nbashaw@gmail.com</a>.</p>");
//        _kmq.push(['record', 'Subscribed']);
//      }
//    });
    
  });
  
  //////////////////////////
  //        ADMIN         //
  //////////////////////////
  
  
  // Deny Job
  $('.deny-job').click(function(){
    var confirmed = confirm("You sure about that?");
    if (confirmed != true) {
      return false;
    }
  });
  
  
  // Approve Job
  $('.approve-job').click(function(){
    var confirmed = confirm("You sure about that?");
    if (confirmed != true) {return false;}
    var id = $(this).attr('id');
    var datastring = 'id=' + id;
    
    $.ajax({
      type: "POST",
      url: "/approve-job",
      beforeSend: function() {
          $("#" + id).parent().html('<h3 id="' + id + '">Tweeting links...</h3>');
      },
      data: datastring,
      success: function() {
          $("#" + id).parent().slideUp();
          alert("done!");
      },
      error: function() {
          console.log('Failure.');
      }
    });
  });
  

});
  
