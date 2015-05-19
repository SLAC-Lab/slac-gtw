/*
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

(function ($, Drupal, window, document) {
  'use strict';

  /**
   * Adds the current Date to the header element.
   */
  Drupal.behaviors.headerDate = {
    attach: function (context, settings) {
      $('.region-header').once('headerDate', function () {
        var monthNames = ['January', 'February', 'March', 'April', 'May',
          'June', 'July', 'August', 'September', 'October', 'November',
          'December'];
        var currentDate = new Date();
        var dateStr = monthNames[currentDate.getMonth()] + ' ' +
            currentDate.getDate() + ', ' +
            currentDate.getFullYear();
        $(this).prepend('<div class="date">' + dateStr + '</div>');
      });
    }
  };

  /**
   * Adds a class to external links and causes them to open in a new window.
   * Note: slac.stanford.edu should not be considered external, nor open in a
   * new window.
   */
  Drupal.behaviors.externalLinks = {
    attach: function (context, settings) {
      var re = new RegExp('/' + window.location.host + '|slac.stanford.edu/');
      $('a', context).each(function () {
        if (this.href.substring(0, 4) === 'http' && !re.test(this.href)) {
          $(this).click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(this.href, '_blank');
          }).addClass('external');
        }
      });
    }
  };

  /**
   * Add a menu toggle link to be displayed at mobile breakpoint which will
   * toggle the class "active" on the menu and the link itself and show/hide
   * the main menu.
   */
  Drupal.behaviors.mobileMenu = {
    attach: function (context, settings) {
      var $menu = $('#block-system-main-menu ul.menu', context);
      var $wrapper = $menu.wrap('<div class="menu-containter" />').parent();

      // Add a menu toggle link for the expandable mobile menu layout.
      var $menuToggle = $('<a href="#menu" class="mobile-menu-toggle"><span class="hamburger-icon"><span class="icon-menu"></span><span class="icon-menu"></span><span class="icon-menu"></span></span>Menu</a>');
      $wrapper.before($menuToggle);

      $menuToggle.click(function (e) {
        e.preventDefault();
        $menuToggle.add($wrapper).toggleClass('active');
        if ($wrapper.is(':visible')) {
          $wrapper.hide();
        }
        else {
          $wrapper.show();
        }
      });
    }
  };

  /**
   * Add a toggle link to be displayed at mobile breakpoint which will
   * toggle the class "active" on the search form container and show/hide it.
   */
  Drupal.behaviors.mobileSearch = {
    attach: function (context, settings) {
      var $searchContainer = $('#block-slac-search-form', context);
      var $searchForm = $searchContainer.find('form');

      // Add a toggle link for the expandable mobile search layout.
      var $toggleLink = $('<a href="#search" class="search-link">Search</a>');
      $searchForm.before($toggleLink);

      $toggleLink.click(function (e) {
        e.preventDefault();
        $toggleLink.add($searchContainer).toggleClass('active');
        if ($searchForm.is(':visible')) {
          $searchForm.hide();
        }
        else {
          $searchForm.show();
        }
      });
    }
  };

  Drupal.behaviors.alphapager = {
    attach: function (context, settings) {
      $('.alpha-link').each(function () {
        var name = $(this).attr('href').substring(1);
        if ($('a[name=' + name + ']').length === 0) {
          $(this).parent().html(name);
        }
      });
    }
  };

  // staff resources page, clicking on a tab goes to a permalink url
  Drupal.behaviors.staff_resource = {
    attach: function (context, settings) {
      var path = Drupal.settings.basePath + 'sites/all/themes/slac/images';
      var text = $('#quicktabs-staff_resources li.active a').text();
      text = text.replace('&', 'and');
      text = text.replace('@', 'at');
      text = text.replace(/ /g, '-');
      text = text.toLowerCase();
      $('.pane-quicktabs-staff-resources .quicktabs-tabpage').css('background', 'whitesmoke url("' + path + '/sr-' + text + '.jpg") no-repeat 0 0');

      $('#quicktabs-staff_resources li a').unbind('click');
      $('#quicktabs-staff_resources li a').click(function () {
        if ($(this).hasClass('active')) {
          var tab_url = $(this).attr('href');
          document.location = tab_url;
        }
      });
    }
  };

  Drupal.behaviors.staffCollapse = {
    attach: function (context, settings) {
      $('<div class="collapse-block">Collapse</div>').insertAfter('.section-staff-resources .ui-accordion-content .view-content');
      $('.collapse-block').click(function () {
        $(this).parents('.ui-accordion-content').eq(0).prev().click();
      });
    }
  };

  Drupal.behaviors.listOddClass = {
    attach: function (context, settings) {
      $('.brown-bodered-white .menu li').filter(function (index) {
        return index % 2 === 0;
      }).addClass('odd');
    }
  };

  Drupal.behaviors.backOnTop = {
    attach: function (context, settings) {
      $('.footer-wrapper', context)
          .before('<a href="#" class="back-on-top"><span>Go to top</span></a>');
    }
  };

  Drupal.behaviors.researchPage = {
    attach: function (context, settings) {
      // this function adds class 'no-children'
      var $links = $('.view-id-research_resource .view-content ul:first > li');
      $links.each(function () {
        var $this = $(this);
        var className = ($this.find('.item-list').length === 1) ? 'parents no-children' : 'parents';
        $this.addClass(className);
      });
    }
  };

  Drupal.behaviors.mobileAccordion = {
    attach: function (context, settings) {
      var $links = $('.view-id-research_resource .parents');

      $links.siblings('.parents').find('.item-list:first').append('<div class="collapse-block">Collapse</div>');
      $('.collapse-block').click(function () {
        $(this).parents('.parents.expanded').find('a.active').click();
      });

      $links.find('.views-field-name:first a').click(function (e) {
        e.preventDefault();
        if ($(window).width() > 620) {
          return;
        }

        var $this = $(this);
        if ($this.hasClass('active')) {
          $this.parents('.parents.expanded').removeClass('expanded')
              .find('.item-list:first').stop(true, true).slideUp('fast');
          $this.removeClass('active');
        }
        else {
          $this.parents('.parents').parent().find('a.active').click();
          $this.parents('.parents').addClass('expanded')
              .find('.item-list:first').stop(true, true).slideDown('fast');
          $this.addClass('active');
        }
      });

      $(window).resize(function () {
        if ($(window).width() > 620) {
          $links.find('.item-list:hidden').show();
        }
        else {
          $links.find('.item-list:first').hide().parents('.parents').filter('.expanded').find('.item-list:first').show();
        }
      });
    }
  };

  Drupal.behaviors.sliderResize = {
    attach: function (context, settings) {
      // fix slider width/height on screen resize
      var resizer = function () {
        var $slider = $('.jcarousel-container');
        if ($slider.length) {
          var normalWidth = $('.frontpage-middle-col').width() + 8 |0;
          $slider.find('.jcarousel-item img').css('width', normalWidth);
        }
      };
      $(window).resize(resizer);

      // frontpage mobile fix
      if ($('body').hasClass('front')) {
        var leftCol = $('.frontpage-left-col'),
          middleCol = $('.frontpage-middle-col'),
          setPosition = function () {
            if ($('#content').css('position') === 'relative') {
              leftCol.addClass('layoutfix').css('top', middleCol.height() + 12);
              middleCol.css('padding-bottom', leftCol.height() - 3);
            }
            else {
              leftCol.attr('style', '').removeClass('layoutfix');
              middleCol.attr('style', '');
            }
          };
      }
    }
  };

  Drupal.behaviors.iePlaceholders = {
    attach: function (context, settings) {
      $('.searchbox').each(function () {
        $(this).prev('label').addClass('search-label');
      });
      $('.searchbox').placeholder();
    }
  };

  Drupal.behaviors.rearange_block = {
    attach: function (context, settings) {
      var cloned = $('.frontpage-left-col .frontpage-calendar, .frontpage-left-col .frontpage-access-info').hide();
      var to_the_place = $('.frontpage-middle-col');

      $(cloned).clone().appendTo($(to_the_place));

      var blocks_rearange = function () {
        if ($(window).width() < 620) {
          $('.frontpage-middle-col .frontpage-calendar, .frontpage-middle-col .frontpage-access-info').css('padding-top', 15).show();
          $('.frontpage-left-col .frontpage-calendar, .frontpage-left-col .frontpage-access-info').hide();
        }
        else {
          $('.frontpage-middle-col .frontpage-calendar, .frontpage-middle-col .frontpage-access-info').hide();
          $('.frontpage-left-col .frontpage-calendar, .frontpage-left-col .frontpage-access-info').show();
        }
      };

      blocks_rearange();

      try {
        window.addEventListener('orientationchange', blocks_rearange);
      } catch (ignore) {}

      $(window).resize(blocks_rearange);
    }
  };

})(jQuery, Drupal, this, this.document);
