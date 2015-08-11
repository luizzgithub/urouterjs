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
- send
- run 

Inclui tambem o Cache AJAX: github.com/paulirish/jquery-ajax-localstorage-cache

**Exemplo
*INDEX

HTML: Declarando o conteudo da /#index ' HOME '
```
  <script type="text/template" id="index"> HOME </script>
```
JS: criando a rota e mostrando 'this.send();'
```
 µ('index', function(p){
	 this.send();
 });
```
----------

*Contato

HTML: Declarando o conteudo do /#contato ' CONTATO <%= teste %> ' usando template ' <%= teste %> '
```
  <script type="text/template" id="contato">
			CONTATO <%= teste %>
	</script>
```
JS: criando a rota e passando o valor do template ' this.teste = "Contato Teste"; ' 
```
 µ('contato', function(p){
	 this.teste = 'Contato Teste';
	 this.send();
 });
```
