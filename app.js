const chat=document.getElementById('chat'),welcome=document.getElementById('welcome'),form=document.getElementById('composer'),input=document.getElementById('prompt');
function addMessage(text,kind){const el=document.createElement('div');el.className=`message ${kind}`;el.textContent=text;chat.appendChild(el);chat.scrollTop=chat.scrollHeight;return el}
function respond(text){const el=addMessage('BUNVIX is thinking…','bot typing');setTimeout(()=>{el.classList.remove('typing');el.textContent=`I’m ready to help with: “${text}”\n\nThis BUNVIX build is currently the frontend foundation. Connect your AI provider through a secure backend to enable real model responses.`},650)}
form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(welcome)welcome.remove();addMessage(text,'user');input.value='';input.style.height='auto';respond(text)});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px'});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.prompt;form.requestSubmit()}));
document.getElementById('clear').addEventListener('click',()=>location.reload());
document.getElementById('newChat').addEventListener('click',()=>location.reload());
document.getElementById('theme').addEventListener('click',()=>document.body.classList.toggle('light'));
document.getElementById('menu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
