window.onload = () => {
    const btnDropDown = document.getElementById('btnDropDown');
    const statement = document.getElementById('container');

    btnDropDown.addEventListener('click', () => {
        const divVertical = btnDropDown.childNodes[1];
        const nameStyle = divVertical.className;
        const isCurrentMore = nameStyle.indexOf('more') !== -1;
        if (isCurrentMore) {
            divVertical.className = 'vertical-less';
            statement.className = 'container more';
        } else {
            divVertical.className = 'vertical-more';
            statement.className = 'container less';
        }
        console.log(divVertical, nameStyle);
    })
}