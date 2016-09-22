import Ember from 'ember';

export default Ember.Controller.extend({
  startDateVar: '',
  endDateVar: '',
  getValue: function() {
    return this.innerHTML;
  },
  setValue: function(s) {
    this.innerHTML = s;
  },
  getValue2: function() {
    if ($('#date-range200').val() && $('#date-range201').val() )
      return $('#date-range200').val() + ' to ' + $('#date-range201').val();
    else
      return '';
  },
  setValue2: function(s,s1,s2) {
    $('#date-range200').val(s1);
    $('#date-range201').val(s2);
  },

  showDateFilter: function(time, date) {
    return '<div style="padding:0 5px;">\
          <span style="font-weight:bold">'+date+'</span>\
          <div style="opacity:0.3;">$'+Math.round(Math.random()*999)+'</div>\
        </div>';
  }


});
