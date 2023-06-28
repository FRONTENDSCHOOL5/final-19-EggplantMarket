//테마 작업 진행중.
const wrapper = document.querySelector('.login-wrapper');
const theme = window.localStorage.getItem('theme');
if (theme === 'highContrast') {
    wrapper.classList.add('highContrast');
    document.body.style.backgroundColor = '#E4D6FF';

} else {
    wrapper.classList.remove('highContrast');
    document.body.style.backgroundColor = '#635CA5'; 
    
}