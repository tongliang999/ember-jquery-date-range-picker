import Ember from 'ember';
import layout from '../templates/components/z-date-picker';
import moment from 'moment';

const { String: { w }} = Ember;

export default Ember.Component.extend({
  classNames: ['js-date-picker'],
  classNameBindings: ['isDateRange::single'],

  layout: layout,

  format: '',
  selector: 'input',
  renderContainer: 'body',

  dateFormat: "YYYY-MM-DD",
  autoClose: true,
  startOfWeek: 'sunday',
  language: 'auto',
  separator: ' ~ ',
  alwaysOpen: false,
  endDate: null,
  startDate: null,
  maxDays: null,
  minDays: null,
  customTopBar: '',
  showTopbar: false,
  selectForward: false,
  selectBackward: false,
  showWeekNumbers: false,
  singleDate: false,
  singleMonth: false,
  stickyMonths: false,
  showShortcuts: false,
  inline: false,
  batchMode: false,

  getValue: null,
  setValue: null,
  showDateFilter: null,
  hoveringTooltip: null,

  showTime: false,
  timeFormat: 'HH:mm',
  rawValue: '',
  isOpen: false,
  showButton: false,
  buttonText: '',
  allowOpen: true,
  _picker: null,

  _format: Ember.computed('format', 'dateFormat', 'timeFormat', 'showTime', function() {
    let format = this.get('format');
    if (format) {
      return format;
    }
    let dateFormat = this.get('dateFormat');
    let timeFormat = this.get('timeFormat');
    let showTime = this.get('showTime');
    return dateFormat + (showTime? ' '+timeFormat: '');
  }),

  setup: Ember.on('didInsertElement', function() {
    const _pickerElement = this.$().find(this.get('selector'));
    this.set('_picker', _pickerElement);

    let opts = this.getProperties(w(
      `autoClose startOfWeek language separator endDate startDate
      maxDays minDays customTopBar showTopbar selectForward selectBackward
      showWeekNumbers singleDate singleMonth stickyMonths showShortcuts
      inline batchMode renderContainer alwaysOpen`
    ));

    opts.container = opts.renderContainer;
    if (!opts.autoClose) {
      opts.showTopbar = true;
    }

    w('getValue setValue showDateFilter hoveringTooltip').map(p => {
      let prop = this.get(p);
      if (!Ember.isNone(prop)) {
        opts[p] = prop;
      }
    })

    opts.time = {
      enabled: this.get('showTime')
    };

    opts.format = this.get('_format');

    _pickerElement.dateRangePicker(opts)
    .bind('datepicker-first-date-selected', (event, obj) => {
      if (this.get('singleDate') && this.get('isDateRange')) {
        this.dateChanged(event, obj);
      }
    })
    .bind('datepicker-change', (event, obj) => {
      if (!this.get('singleDate') || !this.get('isDateRange')) {
        this.dateChanged(event, obj);
      }
    })
    .bind('datepicker-closed', () => {
      this.set('isOpen', false);
    })
    .bind('datepicker-opened', () => {
      this.set('isOpen', true);
    });

    // this.convertTimeToVal(_pickerElement, this.get('startDate'), this.get('endDate'));
  }),

  convertTimeToVal(el, start, end) {
    let startTime = '';
    if (typeof start === 'number') {
      startTime = moment.utc(start*1000).format(this.get('format'));
    }

    let endTime = '';
    if (typeof end === 'number') {
      endTime = moment.utc(end*1000).format(this.get('format'));
    } else {
      endTime = startTime;
    }

    el.data('dateRangePicker').setDateRange(startTime, endTime);
  },

  timezone(timestamp) {
    if (timestamp !== undefined) {
      return moment(timestamp*1000).add(moment(timestamp*1000).utcOffset(), 'minutes').utcOffset()*60;
    } else {
      return moment().add(moment().utcOffset(), 'minutes').utcOffset()*60;
    }
  },

  dateChanged(evt, obj) {
    let time1, time2;
    if (obj.date1 !== undefined) {
      let unixTime = obj.date1.valueOf()/1000;
      unixTime = unixTime + this.timezone(unixTime);

      time1 = moment.utc(unixTime*1000).unix();
      // this.set('startDate', time1);
    }

    if (obj.date2 !== undefined) {
      let unixTime = obj.date2.valueOf()/1000;
      unixTime = unixTime + this.timezone(unixTime);

      time2 = moment.utc(unixTime*1000).endOf('day').unix();
      this.set('endDate', time2);
    }
    let dates = obj.value.split(this.get('separator'));
    if (dates[0]) {
      this.set('begin', dates[0]);
    }
    if (dates[1]) {
      this.set('end', dates[1]);
    }

    this.sendAction('onChange', time1, time2);
  },

  teardown: Ember.on('willDestroyElement', function() {
    if (!Ember.isNone(this.get('_picker'))) {
      this.get('_picker').data('dateRangePicker').destroy();
    }
  }),

  toggle() {
    if (!Ember.isNone(this.get('_picker'))) {
      if (this.get('isOpen')) {
        this.get('_picker').data('dateRangePicker').close();
      } else {
        this.get('_picker').data('dateRangePicker').open();
      }
    }
  },

  actions: {
    containerOpenClose() {
      if (this.get('allowOpen') || !this.get('showButton')) {
        this.toggle();
      }
    },

    openClose() {
      this.toggle();
    }
  }
});
