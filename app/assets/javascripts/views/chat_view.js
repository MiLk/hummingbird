Hummingbird.ChatView = Ember.View.extend({
  shouldScrollToBottom: true,
  ignoreNextScroll: false,

  initializeScrollListener: function() {
    var self = this;
    this.$('.chat-items').bind('scroll.chat', function() {
      Em.run.throttle(self, self.scrollHandler, 50);
    });
  }.on('didInsertElement'),

  teardownScrollListener: function() {
    this.$('.chat-items').unbind('scroll.chat');
  }.on('willClearRender'),

  scrollHandler: function() {
    if (this.get('ignoreNextScroll')) {
      this.set('ignoreNextScroll', false);
      return;
    }

    var chatItems = this.$('.chat-items'),
        stickyOffset = chatItems.prop('scrollHeight') - chatItems.innerHeight() * 0.5,
        scrollBottom = chatItems.prop('scrollTop') + chatItems.innerHeight();

    if (stickyOffset > scrollBottom) {
      this.set('shouldScrollToBottom', false);
    } else {
      this.set('shouldScrollToBottom', true);
    }
  },

  scrollToBottom: function() {
    var rescroll = function() { this.send('rescroll') };
    Em.run.scheduleOnce('afterRender', this, rescroll);
  }.observes('controller.content.@each'),

  actions: {
    rescroll: function() {
      if (this.get('shouldScrollToBottom')) {
        var chatItems = this.$('.chat-items');
        if (chatItems) {
          this.set('ignoreNextScroll', true);
          chatItems.scrollTop(chatItems.prop('scrollHeight'));
        }
      }
    }
  }
});