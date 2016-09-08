$(function() {
  $("input#processar").button();
});

$(document).ready(function(){

  // prepara gradiente aleatório (cores de http://uigradients.com/)
  var gradientes = [ "ffb347", "ffcc33"
                   , "134E5E", "71B280"
                   , "D1913C", "FFD194" 
                   , "7b4397", "dc2430" 
                   , "8e9eab", "eef2f3" 
                   , "2c3e50", "3498db" 
                   , "CCCCB2", "757519" 
                   , "304352", "d7d2cc" 
                   , "000000", "53346D" 
                   , "4b6cb7", "18284" 
                   , "1D2B64", "F8CDDA" 
                   , "5f2c82", "49a09d"
                   , "70e1f5", "ffd194"
                   ]
  var grad_escolhido = Math.floor((Math.random() * Math.floor(gradientes.length / 2)));
  $("body").attr("style", "background: linear-gradient(90deg, #" + gradientes[grad_escolhido * 2] + " 10%, #" + gradientes[(grad_escolhido * 2) + 1] + " 90%)")

  // prepara primeira transição dos resultados
  var fade_delay = 0;
  
	$("input#processar").click(function(){

    $("div#resultado").fadeOut(fade_delay, function() {
      /* limpa tudo */
      fade_delay = 200;
      $("div#erro").hide();
      $("div#resultado").hide(); 
      $("div#erro").html(""); 
      $("div#frente").html("");
      $("div#verso").html("");
      $("div#obs").html("");
      
      /* validações */
      var erros = [];
      if (($("input#intervalo_ini").val().trim() == "") || ($("input#intervalo_fim").val().trim() == ""))
        erros.push("É necessário preencher um intervalo.");
      if ((!$.isNumeric($("input#intervalo_ini").val())) || (!$.isNumeric($("input#intervalo_fim").val())))
        erros.push("O intervalo deve ser composto por números.");
      if (parseInt($("input#intervalo_ini").val(),10) > parseInt($("input#intervalo_fim").val(),10))
        erros.push("O início do intervalo não pode ser maior que o seu fim.");
      if ( !($("input#paginacao_2").prop("checked")) && !($("input#paginacao_4").prop("checked")))
        erros.push("É necessário escolher uma quantidade de páginas por folha.");
      if (erros.length)
        dispara_erro(erros);
        
      /* calcular resultado */
      if (!erros.length) {
        if ($("input#paginacao_2").prop('checked'))
          calcular_intervalo(parseInt($("input#intervalo_ini").val().trim(),10), parseInt($("input#intervalo_fim").val().trim(),10), 2)
        else
          calcular_intervalo(parseInt($("input#intervalo_ini").val().trim(),10), parseInt($("input#intervalo_fim").val().trim(),10), 4)
      }
         
    });
  
  });
  
  // função que calcula os resultados
  calcular_intervalo = function(ini, fim, qtde) {

    var frente = atual = {};
    var verso = {};
    frente.paginas = "";
    verso.paginas = "";
    var inversor = 0;
    var pagina = ini;
    
    while (pagina <= fim) {
      atual.paginas += pagina + ";";
      inversor++;
      if (inversor == qtde) {
        if (atual == frente)
          atual = verso;
        else
          atual = frente;
        inversor = 0;
      }
      pagina++;
    }

    frente.paginas = frente.paginas.slice(0, -1);
    verso.paginas = verso.paginas.slice(0, -1);
    
    /*console.log("-----------------------");
    console.log("frente = " + frente.paginas);
    console.log("verso = " + verso.paginas);*/
    $("div#frente").html("Páginas da frente: " + frente.paginas);
    $("div#verso").html("Páginas do verso: " + verso.paginas);
    
    if (((frente.paginas.match(/;/g) || []).length + 1) % qtde > ((verso.paginas.match(/;/g) || []).length + 1) % qtde)
      $("div#obs").html("Obs.: após a impressão das páginas da frente, retire uma folha antes de recolocá-las na impressora.");    
    
    $("div#resultado").fadeIn(fade_delay);   
  }
  
  // função que exibe erros 
  dispara_erro = function(erros) {
    var linebreak = "";
    for (var i = 0; i < erros.length; i++) {
      /*console.log(erros[i]); */
      $("div#erro").html($("div#erro").html() + linebreak + erros[i]);
      linebreak = "<br />";
    }
    $("div#erro").fadeIn(fade_delay);   
  }
  
  // ao apertar ENTER, o botão "Processar" é clicado
  $("div#intervalo input").keypress(function(e){
    if (e.keyCode==13)
      $("#processar").click();
  });
  
});