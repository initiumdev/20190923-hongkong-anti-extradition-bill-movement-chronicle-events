const items = document.querySelectorAll(".timeline"),
    articles = document.querySelectorAll(".article"),
    filterTypeBtns = document.getElementsByClassName('typeFilterBtn'),
    monthFilterBtns = document.getElementsByClassName('monthFilterBtn'),
    dayFilterBtns = document.getElementsByClassName('dayFilterBtn'),
    clearFilter = document.getElementById('clearFilterBtn');



function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ ;
}
// code for the isElementInViewport function

function scrollFunction() {
    for (var i = 0; i < items.length; i++) {
        if (isElementInViewport(items[i])) {
            if (items[i].classList.contains('hide')) return;
            items[i].classList.add("in-view");
        }
    }
}

function updateContent(init) {
    let typeFilterActive = document.getElementsByClassName('typeFilterBtn active'),
        monthFilterActive = document.getElementsByClassName('monthFilterBtn active'),
        dayFilterActive = document.getElementsByClassName('dayFilterBtn active');
    let typeExistence = typeof typeFilterActive[0] !== 'undefined',
        monthExistence = typeof monthFilterActive[0] !== 'undefined',
        dayExistence = typeof dayFilterActive[0] !== 'undefined';

    let clearAll = typeExistence && typeFilterActive[0].dataset.type === 'all';
    if (clearAll) {
        clearBtnFuction();
    }
    let currentMonth = null;
    if (monthExistence) {
        currentMonth = monthFilterActive[0].dataset.month;
    } else if (dayExistence) {
        currentMonth = dayFilterActive[0].dataset.month;
    }
    let filterMonth = (currentMonth) ? (moment().format('Y') + '-' + currentMonth) : null,
        filterSort = (dayExistence) ? (dayFilterActive[0].dataset.sort == 0) : null,
        lastDay = (dayExistence) ? moment(filterMonth, 'YYYY-MM').endOf('month').format('DD') : null,
        startTime = (dayExistence) ? (filterMonth + '-' + ((filterSort) ? '01' : '16')) : null,
        endTime = (dayExistence) ? (filterMonth + '-' + ((filterSort) ? '15' : lastDay)) : null;

    let lastArticleIndex = 0;
    for (let index = 0; index < articles.length; index++) {
        let articleDataset = articles[index].dataset,
            articleType = articleDataset.type,
            articleTime = articleDataset.time;

        // Reset all articles class
        if (!init) {
            if (clearAll) {
                articles[index].className = 'timeline article';
            } else {
                let articleClassName = 'timeline article';
                if (typeof articleType === 'undefined' || typeof articleTime === 'undefined') {
                    articleClassName += ' hide';
                } else {
                    // filter articles - type
                    if (typeExistence) {
                        if (articleType.indexOf(typeFilterActive[0].dataset.type) < 0) {
                            articleClassName += ' hide ';
                        } else {
                            lastArticleIndex = index;
                        }
                    }
                    // filter articles - month
                    if (monthExistence && articleClassName.indexOf('hide') < 0) {
                        let articleMoment = moment(articleTime, "YYYYMMDD");
                        if (moment(articleMoment).isSame(filterMonth + '-01', 'month')) {
                            lastArticleIndex = index;
                        } else {
                            articleClassName += ' hide ';
                        }
                    }
                    // filter articles - day
                    if (dayExistence && articleClassName.indexOf('hide') < 0) {
                        let articleMoment = moment(articleTime, "YYYYMMDD");
                        // A '[' indicates inclusion of a value
                        if (moment(articleMoment).isBetween(startTime, endTime, 'day', '[]')) {
                            lastArticleIndex = index;
                        } else {
                            articleClassName += ' hide ';
                        }
                    }
                }
                articles[index].className = articleClassName;
            }

        }
    }
    if (!init && !clearAll) {
        $('html,body').animate({
            scrollTop: $('#main-timeline').height() - $('.credits').height() / 1.8
        }, 'slow');
    }
    scrollFunction();
}

function clearBtnFuction() {
    for (let i = 0; i < filterTypeBtns.length; ++i) {
        filterTypeBtns[i].setAttribute('class', 'typeFilterBtn');
    }
    for (let i = 0; i < monthFilterBtns.length; ++i) {
        monthFilterBtns[i].setAttribute('class', 'monthFilterBtn');
    }
    for (let i = 0; i < dayFilterBtns.length; ++i) {
        dayFilterBtns[i].setAttribute('class', 'dayFilterBtn');
    }
}

function allResourcesFinishedLoading() {
    updateContent(true)
    // Type filter button add EventListener function
    for (let index = 0; index < filterTypeBtns.length; index++) {
        filterTypeBtns[index].addEventListener("click", function (e) {
            if (e.target.classList.contains('active')) return;
            // Init: Add classnane (filter) for current cliclk button
            for (let i = 0; i < filterTypeBtns.length; ++i) {
                filterTypeBtns[i].setAttribute('class', 'typeFilterBtn filter');
            }

            // Remove all button classname (active)
            let targetBtn = document.querySelectorAll('.typeFilterBtn.active');
            if (typeof targetBtn[0] !== 'undefined') {
                targetBtn[0].classList.remove('active');
            }

            // Add classnane (active) for current cliclk button
            e.target.setAttribute("class", "typeFilterBtn filter active");

            updateContent(false);
        })
    }
    // Month filter button add EventListener function
    for (let index = 0; index < monthFilterBtns.length; index++) {
        monthFilterBtns[index].addEventListener("click", function (e) {
            if (e.target.classList.contains('active')) return;
            // Init: Add classnane (filter) for current cliclk button
            for (let i = 0; i < monthFilterBtns.length; ++i) {
                monthFilterBtns[i].setAttribute('class', 'monthFilterBtn filter');
            }

            // Remove all button classname (active)
            let targetDayBtn = document.querySelectorAll('.monthFilterBtn.active');
            if (typeof targetDayBtn[0] !== 'undefined') {
                targetDayBtn[0].classList.remove('active');
            }

            // Add classnane (active) for current cliclk button
            e.target.setAttribute("class", "monthFilterBtn filter active");

            updateContent(false);
        })
    }
    // Day filter button add EventListener function
    for (let index = 0; index < dayFilterBtns.length; index++) {
        dayFilterBtns[index].addEventListener("click", function (e) {
            if (e.target.classList.contains('active')) return;
            // Init: Add classnane (filter) for current cliclk button
            for (let i = 0; i < dayFilterBtns.length; ++i) {
                dayFilterBtns[i].setAttribute('class', 'dayFilterBtn filter');
            }

            // Remove all button classname (active)
            let targetDayBtn = document.querySelectorAll('.dayFilterBtn.active');
            if (typeof targetDayBtn[0] !== 'undefined') {
                targetDayBtn[0].classList.remove('active');
            }

            // Add classnane (active) for current cliclk button
            e.target.setAttribute("class", "dayFilterBtn filter active");

            updateContent(false);
        })
    }
    scrollFunction();
    document.getElementById('maincontainer').setAttribute("class", "");
}

$(function () {
    $('#gotop').click(function () {
        $('html,body').animate({
            scrollTop: $("#menu-section").offset().top
        }, 'slow');
    });
    $(window).scroll(function () {
        if ($(this).scrollTop() > 600) {
            $('#gotop').fadeIn();
        } else {
            $('#gotop').fadeOut();
        }
    });
    // gotop
    if ($(window).scrollTop() > 0) {
        $('html,body').animate({
            scrollTop: 0
        }, 'slow');
    }
});


window.addEventListener("load", allResourcesFinishedLoading);
window.addEventListener("scroll", scrollFunction);