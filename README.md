# urouterjs
Mini router js

Necessita do jQuery, RJSON(se usar ajax), UnderscoreJS(se usar template)

Metodos:
- conf
- ajax(jQuery)
- db(Localstorage)
- tmpl(UnderscoreJS) 
- redirect 
- add(Routa) ou µ('index');
- send (Mostrar o resultado)
- run (Inicializa as config e rotas)

Inclui tambem o Cache AJAX: github.com/paulirish/jquery-ajax-localstorage-cache

**Exemplo
*INDEX

HTML: Declarando o conteudo da http://app/#index => ' HOME '
```
  <script type="text/template" id="index"> HOME </script>
```
JS: criando a rota e mostrando com 'this.send();'
```
 // Vai procurar <script id="index" />
 µ('index', function(p){
	 this.send();
 });
```
----------

*Contato

HTML: Declarando o conteudo do http://app/#contato => ' CONTATO <%= teste %> ' usando template ' <%= teste %> '
```
  <script type="text/template" id="contato">
			CONTATO <%= teste %>
  </script>
```
JS: criando a rota e passando o valor do template ' this.teste = "Contato Teste"; ' 
```
 // Vai procurar <script id="contato" />
 µ('contato', function(p){
	 this.teste = 'Contato Teste'; // Vai para <%= teste %>
	 this.send();
 });
```
