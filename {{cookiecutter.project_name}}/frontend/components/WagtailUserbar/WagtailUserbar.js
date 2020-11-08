import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const WagtailUserbar = ({ html }) => {
    useEffect(() => {
        // This  code is copy patested from
        // https://github.com/wagtail/wagtail/blob/master/wagtail/admin/static_src/wagtailadmin/js/userbar.js
        var userbar = document.querySelector('[data-wagtail-userbar]');
        var trigger = userbar.querySelector('[data-wagtail-userbar-trigger]');
        var list = userbar.querySelector('.wagtail-userbar-items');
        var className = 'is-active';
        var hasTouch = 'ontouchstart' in window;
        var clickEvent = 'click';

        if (hasTouch) {
            userbar.classList.add('touch');

            // Bind to touchend event, preventDefault to prevent DELAY and CLICK
            // in accordance with: https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
            trigger.addEventListener('touchend', function preventSimulatedClick(
                e
            ) {
                e.preventDefault();
                toggleUserbar(e);
            });
        } else {
            userbar.classList.add('no-touch');
        }

        trigger.addEventListener(clickEvent, toggleUserbar, false);

        // make sure userbar is hidden when navigating back
        window.addEventListener('pageshow', hideUserbar, false);

        function showUserbar(e) {
            userbar.classList.add(className);
            list.addEventListener(clickEvent, sandboxClick, false);
            window.addEventListener(clickEvent, clickOutside, false);
        }

        function hideUserbar(e) {
            userbar.classList.remove(className);
            list.addEventListener(clickEvent, sandboxClick, false);
            window.removeEventListener(clickEvent, clickOutside, false);
        }

        function toggleUserbar(e) {
            e.stopPropagation();
            if (userbar.classList.contains(className)) {
                hideUserbar();
            } else {
                showUserbar();
            }
        }

        function sandboxClick(e) {
            e.stopPropagation();
        }

        function clickOutside(e) {
            hideUserbar();
        }
    });

    // Strip away the scrip tag since we use our own
    html = html.replace(/<script[^\0]*<\/script>/g, '');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

WagtailUserbar.propTypes = {
    html: PropTypes.string.isRequired,
};

export default WagtailUserbar;
