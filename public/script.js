$(function() {
  
  // Subscribe Form
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
        .append("<p>We'll let you know when jobs are posted. You can always unsubscribe at <a href='/unsubscribe'>hackersandhustlers.org/unsubscribe</a></p>");
        _kmq.push(['record', 'Subscribed']);
      }
    });
    
    return false;
  });
  
  // Unsubscribe Form
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
 
  //Preview Job
  $('#preview-job-button').click(function(e) {
    if($('.control-group').is(':visible')) { 
      $('#preTitle').text($('input#position').val());
      $('#preBiz').text($('input#company').val());
      var converter = new Showdown.converter();
      var mdDesc = converter.makeHtml($('textarea#description').val());
      $('#preDesc').html(mdDesc);
      var popurl = 'http://' + $('input#url').val();
      $('#preBiz').prop( 'href', popurl);
      var popemail = 'mailto:' + $('input#email').val();
      $('#preEmail').prop( 'href', popemail);
      $('#preEmail').text('Email ' + $('#preBiz').text() + ' about this job');
      var $location = $('input#location').val();
      $('#preLocation p').text($location);
      $('#preLocation img').attr('src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + escape($location) + '&zoom=10&size=100x100&sensor=false');

      if($(':checked').val() == 'fulltime') {
        $('#preType').removeClass('label-info label-warning');
        $('#preType').addClass('label label-success');
        $('#preType').text('full time');
      }
      else if($(':checked').val() == 'cofounder') {
        $('#preType').removeClass('label-success label-warning');
        $('#preType').addClass('label label-info');
        $('#preType').text('co-founder');
      }
      else if($(':checked').val() == 'intern') {
        $('#preType').removeClass('label-success label-warning label-info');
        $('#preType').addClass('label');
        $('#preType').text('intern');
      }
      else if($(':checked').val() == 'contract') {
        $('#preType').removeClass('label-success label-info');
        $('#preType').addClass('label label-warning');
        $('#preType').text('contract');
      }

      $('#preview-job-button').text('Edit Job');
    }else{
      $('#preview-job-button').text('Preview Job');
    }
    $('.control-group').toggle(200);
    $('#job-preview').toggle(400);
   });
  
 
  // Create Job Form
  $('.jserror').hide(); // hide errors

  $('#create-job-submit').click(function(e) {
    
     // hide previous errors
    $('.jserror').hide();
    
    var position = $("input#position").val();
    var job_type = $("input.job_type:checked").val();
    var company = $("input#company").val();
    var location = $("input#location").val();
    var url = $("input#url").val();
    var email = $("input#email").val();
    var description = $("textarea#description").val();
    var badger = $("input#badger").val();
    
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
    
    // validate location input
    if (location == "") {
      $("#location_error").show();
      $("#location_error").parent().parent().addClass('error');
      $("input#location").focus();
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
    
    var data = {"position": position, "job_type": job_type, "company": company, "location": location, "url": url, "email": email, "description": description, "badger": badger};

    // post the form using ajax
    $.ajax({  
      type: "POST",  
      url: "/create-job",
      data: data,
      beforeSend: function() {
        // Show loading state
        var loadingState = '<div class="loader"><span></span> <span></span> <span></span></div>';
        $('#create-job-form').html(loadingState);
      },
      success: function() {
        $('#create-job-form').html("<div id='message'></div>");  
        $('#message').html("<h2>Job Posted!</h2>")  
        .append("<p>We'll review it and get back to you as soon as possible. If you've got any questions, just email <a href='mailto:nbashaw@gmail.com'>nbashaw@gmail.com</a>.</p>");
        _kmq.push(['record', 'Subscribed']);
      }
    });
    
    $("#create-job-form").ajaxError(function(event, request, settings){
      $('.loader').hide();
      $(this).append("<h2>Oops! Something Went Wrong...</h2><p>Probably an encoding error - email or chat with us? Hit \"refresh\" to see the post-job form again.</p>");
      olark('api.box.expand');
      console.log([event, request, settings]);
    });
    
    return false;
  });
  
  //////////////////////////
  //        ADMIN         //
  //////////////////////////
  
  
  // Deny Job
  $('.deny-job').click(function(){
    var confirmed = confirm("You sure you want to deny the job?");
    if (confirmed != true) {return false;}
  });
  
  
  // Approve Job
  $('.approve-job').click(function(){
    var confirmed = confirm("You sure you want to approve the job?");
    if (confirmed != true) {return false;}
  });

});
  
