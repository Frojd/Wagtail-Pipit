import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'
import s from './CookieNotice.module.css'


const CookieNoticePreferences = ({
    cookies, categories, approvals, onUpdateCategory, onUpdateCookie, onClose
}) => {
    let {
        categories: categoryApprovals,
        cookies: cookieApprovals,
    } = approvals;

    categoryApprovals = categoryApprovals || [];
    cookieApprovals = cookieApprovals || [];

    const handleCategoryToogleClick = (e) => {
        e.preventDefault();

        const slug = e.currentTarget.value;
        onUpdateCategory({
            key: slug,
            value: !categoryApprovals.includes(slug),
        });
    }

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }

    const handleCookieToogleClick = (e) => {
        e.preventDefault();

        const slug = e.currentTarget.value;
        onUpdateCookie({
            key: slug,
            value: !cookieApprovals.includes(slug),
        });
    }

    return (
        <div>
            <button onClick={handleCloseClick}>Close</button>
            {categories.map(({ name, slug }) => {
                const categoryCookies = cookies.filter(
                    ({ category }) => category === slug
                );

                return (
                    <div key={slug}>
                        <p>{name}</p>
                        <button
                            onClick={handleCategoryToogleClick}
                            value={slug}
                        >{categoryApprovals.includes(slug) ? 'Deactivate' : 'Activate'}</button>
                        <div>
                            {categoryCookies.map((cookie, index) => {
                                return (
                                    <div key={index}>
                                        <p>{cookie.name}</p>
                                        <button
                                            onClick={handleCookieToogleClick}
                                            value={cookie.name}
                                        >{cookieApprovals.includes(cookie.name) ? 'Deactivate' : 'Activate'}</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


const CookieNotice = ({
    isInitialOpen,
    title,
    content,
    cookies,
    categories,
    getApprovals,
    writeApprovals,
    onClose,
}) => {
    console.log('CookieNotice', isInitialOpen);

    const [isOpen, setIsOpen] = useState(isInitialOpen);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [approvals, setApprovals] = useState(getApprovals());
    const handleOpenSettingsClick = (e) => {
        e.preventDefault();
        setIsPreferencesOpen(true);
    }

    const handleAcceptClick = (e) => {
        e.preventDefault();

        onClose();
        setIsOpen(false);
    }

    const handleOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsPreferencesOpen(false);
    }

    const handleUpdateCookie = ({ key, value}) => {
        let approvedCookies = approvals.cookies || [];
        approvedCookies = approvedCookies.filter(x => x !== key);

        if (value) {
            approvedCookies = [...approvedCookies, key];
        }

        const updatedApprovals = {
            ...approvals,
            cookies: approvedCookies,
        }

        writeApprovals(updatedApprovals);
        setApprovals(updatedApprovals);
    }

    const handleUpdateCategory = ({ key, value }) => {
        let approvedCategories = approvals.categories || [];
        approvedCategories = approvedCategories.filter(x => x !== key);

        if (value) {
            approvedCategories = [...approvedCategories, key];
        }

        const updatedApprovals = {
            ...approvals,
            categories: approvedCategories,
        }

        writeApprovals(updatedApprovals);
        setApprovals(updatedApprovals);
    }

    if (!isOpen) {
        return (
            <div>Closed <button onClick={handleOpen}>Open</button></div>
        )
    }

    if (isPreferencesOpen) {
        return (
            <CookieNoticePreferences
                cookies={cookies}
                categories={categories}
                approvals={approvals}
                onUpdateCategory={handleUpdateCategory}
                onUpdateCookie={handleUpdateCookie}
                onClose={handleClose}
            />
        );
    }

    return (
        <div className={s.Root}>
            <h2>{title}</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <div>
                <button onClick={handleOpenSettingsClick}>Cookie settings</button>
                <button onClick={handleAcceptClick}>Accept</button>
            </div>
        </div>
    );
}

CookieNotice.defaultProps = {
}

CookieNotice.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    getApprovals: PropTypes.func,
};

const withCookies = (Component) => (props) => {
    const getApprovals = () => {
        let approvals = Cookies.get('cookieNoticeApprovals');
        if (approvals) {
            approvals = JSON.parse(approvals);
        }
        return approvals || {};
    }

    const writeApprovals = (approvals) => {
        const approvalsSerialized = JSON.stringify(approvals);
        Cookies.set('cookieNoticeApprovals', approvalsSerialized);
    }

    const handleClose = () => {
        Cookies.set('cookieNoticeViewed', '1');
    }

    const viewed = Cookies.get('cookieNoticeViewed') === "1";

    return (
        <Component
            getApprovals={getApprovals}
            writeApprovals={writeApprovals}
            isInitialOpen={!viewed}
            onClose={handleClose}
            {...props}
        />
    );

}

export default withCookies(CookieNotice);
