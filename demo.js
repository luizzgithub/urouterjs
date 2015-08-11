
 µ().conf(
 	document.getElementById('container-tpl'), //Elemento body || palco
 	function(){ console.log('Mudou de pagina'); } //Function executada toda alteração de pagina
 	);
 	
// Home, index é rota tambem é script#index
 µ('index', function(p){
	 
	 this.send();
 });
 // Contato, contato é rota tambem é script#contato
 µ('contato', function(p){
	 
	 this.teste = 'Contato Teste';
	 
	 this.send();
 });
 
 //µ('teste\/([a-z]{3})/([a-z]{3})/([a-z]{3})', function(data){ console.log(data); alert('lol'); });
 
 //µ('teste\/([a-z]{3})', function(data){ console.log(data); alert('lol'); });

//Inicializa as rotas e recebe o callback
 µ().run(function(isrun){
    if(isrun === false){
        alert('Erro ao iniciar.');
    };
 });

