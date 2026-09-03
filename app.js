const chat=document.getElementById('chat'),welcome=document.getElementById('welcome'),form=document.getElementById('composer'),input=document.getElementById('prompt');
const SUPABASE_URL=window.BUNVIX_CONFIG?.SUPABASE_URL||'';
const SUPABASE_ANON_KEY=window.BUNVIX_CONFIG?.SUPABASE_ANON_KEY||'';
const FUNCTION_URL=SUPABASE_URL?`${SUPABASE_URL}/functions/v1/chat`:'';
let accessToken=window.BUNVIX_CONFIG?.ACCESS_TOKEN||'';
function addMessage(text,kind){const el=document.createElement('div');el.className=`message ${kind}`;el.textContent=text;chat.appendChild(el);chat.scrollTop=chat.scrollHeight;return el}
async function respond(text){const el=addMessage('BUNVIX is thinking…','bot typing');try{if(!FUNCTION_URL||!accessToken)throw new Error('BUNVIX is not connected yet. Add your Supabase settings in config.js.');const r=await fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':`Bearer ${accessToken}`},body:JSON.stringify({message:text})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');el.classList.remove('typing');el.textContent=data.answer}catch(e){el.classList.remove('typing');el.textContent=e.message}}
form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;if(welcome)welcome.remove();addMessage(text,'user');input.value='';input.style.height='auto';respond(text)});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px'});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.prompt;form.requestSubmit()}));
document.getElementById('clear').addEventListener('click',()=>location.reload());document.getElementById('newChat').addEventListener('click',()=>location.reload());document.getElementById('theme').addEventListener('click',()=>document.body.classList.toggle('light'));document.getElementById('menu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
