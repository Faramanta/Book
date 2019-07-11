jest.dontMock('fs').dontMock('jquery');

const $ = require('jquery');
const html = require('fs').readFileSync('./src/index.html').toString();

describe('Test initial state popup', function() {
  
  it('form elements should be hidden', function() {
 
    document.documentElement.innerHTML = html;
    expect($('.popup__loading').css('display')).toBe('none');
    expect($('#error').css('display')).toBe('none');
    expect($('#form-get-code').css('display')).toBe('none');
    expect($('#form-enter-code').css('display')).toBe('none');
  
  });

    it('throbber should be visible', function() {
 
    document.documentElement.innerHTML = html;
    
    expect($('#throbber').css('display')).toBe('block');
  
  });
  
 
});