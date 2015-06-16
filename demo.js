
 µ().conf(document.getElementById('container-tpl'));
    
 µ('index', function(p){
	 this.send();
 });
 
 µ('contato', function(p){
	 this.send();
 });
 
 //µ('teste\/([a-z]{3})/([a-z]{3})/([a-z]{3})', function(data){ console.log(data); alert('lol'); });
 
 //µ('teste\/([a-z]{3})', function(data){ console.log(data); alert('lol'); });

 µ().run(function(isrun){
    if(isrun === false){
        alert('Erro ao iniciar.');
    };
 });

