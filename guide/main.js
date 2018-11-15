$( document ).ready(function () {
  var guid,
    is_rental,
    is_modern,
    is_ios,
    doors_count,
    switches_count,
    onoff_switches_count,
    plug_switches_count,
    bulbs_count,
    steps_completed,
    total_steps = $(".slide").length;

  if (navigator.userAgent.match(/iPhone/)) {
    is_ios = true;
  } else if (navigator.userAgent.match(/Android/)) {
    is_ios = false;
  }

  var $content = $("#content_frd"),
      $content_wrapper = $("#content"),
      $steps_remaining = $("#steps_remaining");

  $content.empty();

  var swap_slides = function(new_slide) {
    $content_wrapper.append($content.children());
    $content.append(new_slide);
    $steps_remaining.width(steps_completed/total_steps*100 + "%");
  };

  var choose_slide = function() {
    steps_completed = 1;

    if (typeof guid === 'undefined') {
      swap_slides($("#intro"));
      return;
    }
    steps_completed++;

    if (typeof is_rental === 'undefined') {
      swap_slides($("#is_rental"));
      return;
    }
    steps_completed++;

    if (typeof is_ios === 'undefined') {
      swap_slides($("#is_ios"));
      return;
    }
    steps_completed++;

    if (typeof doors_count === 'undefined') {
      swap_slides($("#ask_doors_count"));
      return;
    }
    steps_completed++;

    if (typeof switches_count === 'undefined' && !is_rental) {
      swap_slides($("#ask_switches_count"));
      return;
    }
    steps_completed++;

    if (typeof onoff_switches_count === 'undefined' && switches_count > 0) {
      swap_slides($("#ask_onoff_switches_count"));
      return;
    }
    steps_completed++;

    if (typeof is_modern === 'undefined' && onoff_switches_count > 0) {
      swap_slides($("#is_modern"));
      return;
    }
    steps_completed++;

    if (typeof plug_switches_count === 'undefined' && switches_count > 0) {
      swap_slides($("#ask_plug_switches_count"));
      return;
    }
    steps_completed++;

    if (typeof bulbs_count === 'undefined' && (is_rental || is_modern === false)) {
      swap_slides($("#ask_bulbs_count"));
      return;
    }
    steps_completed++;

    if (is_rental) {
      // no thermostat or shades
      $("#thermostat_sec").addClass("disabled");
      $("#shades_sec").addClass("disabled");
    }

    if (switches_count > 0) {
      $("#lutron_hub").removeClass("na");
      dimmer_switches = switches_count - onoff_switches_count;
      if (dimmer_switches > 2) {
        dimmer_switches -= 2;
        $("#final_dimmer_count").text(dimmer_switches);
        $("#lutron_dimmer .price").text("$" + dimmer_switches * 60);
        $("#lutron_dimmer").removeClass("na");
      }
      if (onoff_switches_count > 0) {
        $("#final_onoff_count").text(onoff_switches_count);
        $("#lutron_onoff .price").text("$" + onoff_switches_count * 60);
        $("#lutron_onoff").removeClass("na");
      }
      if (plug_switches_count > 0) {
        $("#final_plug_count").text(plug_switches_count);
        $("#lutron_plug .price").text("$" + plug_switches_count * 60);
        $("#lutron_plug").removeClass("na");
      }
    } else if (bulbs_count > 0) {
      $("#hue_hub").removeClass("na");
      if (bulbs_count > 4) {
        bulbs_count -= 4;
        $("#final_bulb_count").text(bulbs_count);
        $("#hue_white .price").text("$" + bulbs_count * 15);
        $("#hue_white").removeClass("na");
      }
    } else {
      $("#lights_sec").addClass("disabled");
    }

    if (is_ios) {
      $("#thermostat_sec #ecobee").removeClass("na");
      $("#speakers_sec #homepod").removeClass("na");
      $("#platform_sec #homekit").removeClass("na");
    } else {
      $("#thermostat_sec #nest").removeClass("na");
      $("#speakers_sec #googlehome").removeClass("na");
      $("#platform_sec #googleassistant").removeClass("na");
    }

    $("#final_door_count").text(doors_count);
    $("#hiome_occ .price").text("$" + (doors_count * 89));

    swap_slides($("#results"));
    // var total = 0;
    // $(".price:visible").each(function() {
    //   var amt = $(this).text().match(/^\$(\d+)/);
    //   if (amt)
    //     total += parseInt(amt[1]);
    // });
    // $("#subtotal .price strong").text("$" + total);
  };

  choose_slide();

  $("#start").click(function() {
    guid = "somethingrandom";
    choose_slide();
  });

  $("#before_1980").click(function() {
    is_modern = false;
    choose_slide();
  });

  $("#after_1980").click(function() {
    is_modern = true;
    choose_slide();
  });

  $("#rent").click(function() {
    is_rental = true;
    choose_slide();
  });

  $("#own").click(function() {
    is_rental = false;
    choose_slide();
  });

  $("#android").click(function() {
    is_ios = false;
    choose_slide();
  });

  $("#iphone").click(function() {
    is_ios = true;
    choose_slide();
  });

  $("#save_door_count").click(function() {
    doors_count = $("#doors_count").val();
    choose_slide();
  });

  $("#save_bulb_count").click(function() {
    bulbs_count = $("#bulbs_count").val();
    choose_slide();
  });

  $("#save_switch_count").click(function() {
    switches_count = $("#switches_count").val();
    $(".total_switches_count").text(switches_count);
    choose_slide();
  });

  $("#save_onoff_switch_count").click(function() {
    onoff_switches_count = $("#onoff_switches_count").val();
    choose_slide();
  });

  $("#save_plug_switch_count").click(function() {
    plug_switches_count = $("#plug_switches_count").val();
    choose_slide();
  });

  $(".result_content input").change(function(e) {
    $(this).parent().toggleClass("striked");
  });
});
