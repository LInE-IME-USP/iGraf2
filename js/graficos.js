      var stage;
      var scale;
      var cartesianWidth;
      var cartesianHeight;
      var normalWidth;
      var normalHeight;
      
      var axisLayer;
      var axis;

      var smallerGridLayer;
      var smallerVerticalLines;
      var smallerHorizontalLines;

      var biggerGridLayer;
      var biggerVerticalLines;
      var biggerHorizontalLines;

      var chartLayer;

      var lastCursorX;
      var lastCursorY;
      var isDragging;

      var textLayer;
      var xTextLabels;
      var yTextLabels;
      var isXBlocked;
      var isYBlocked;
      var cumulatedXOffset;
      var cumulatedYOffset;

      //aqui width e height estão normalizados
      function initLines(currentLayer,verticalArray, horizontalArray, offset, width, height, color){
        for(var i = 0; i <= width/2; i+=offset){
          if(i!=width/2 && i != 0){
            var line1 = new Kinetic.Line({
                points: [i+0.5, -height/2, i+0.5, height/2],
                stroke: color,
                strokeWidth: 0.1
            });
            verticalArray.push(line1);
            currentLayer.add(line1);
          }
          var line2 = new Kinetic.Line({
            points: [-i+0.5, -height/2, -i+0.5, height/2],
            stroke: color,
            strokeWidth: 0.1
          });
          verticalArray.push(line2);
          currentLayer.add(line2);
        }
        for(var i = 0; i <= height/2; i+=offset){
          if(i != height/2 && i !=0){
            var line1 = new Kinetic.Line({
              points: [-width/2, i+0.5, width/2, i+0.5],
              stroke: color,
              strokeWidth: 0.1
            });
            horizontalArray.push(line1);
            currentLayer.add(line1);
          }
          var line2 = new Kinetic.Line({
            points: [-width/2, -i+0.5, width/2, -i+0.5],
            stroke: color,
            strokeWidth: 0.1
          });
          horizontalArray.push(line2);
          currentLayer.add(line2);
        }
      }

      function reDrawAxis(xOffset, yOffset){
        if(xOffset != 0){
          axis[1].getPoints()[0].x = (axis[1].getPoints()[0].x + xOffset);
          axis[1].getPoints()[1].x = (axis[1].getPoints()[1].x + xOffset);
        }
        if(yOffset!=0){
          axis[0].getPoints()[0].y = (axis[0].getPoints()[0].y + yOffset);
          axis[0].getPoints()[1].y = (axis[0].getPoints()[1].y + yOffset);
        }
      }
      
      function reDrawGrid(width, height, xOffset, yOffset, horizontalLines, verticalLines, layer){
        for(var i = 0; i < verticalLines.length; i++){
          currentLineX = verticalLines[i].getPoints()[0].x;
          if(xOffset != 0){
            if(xOffset > 0){//direita
              if(currentLineX + xOffset > width/2){//ta no final, preciso mudar pro começo...
                verticalLines[i].getPoints()[0].x = (currentLineX - width + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX - width + xOffset);
              } else {
                verticalLines[i].getPoints()[0].x = (currentLineX + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + xOffset);
              }
            }else{//esquerda
              if(currentLineX + xOffset < -width/2){//ta no final à esquerda
                verticalLines[i].getPoints()[0].x = (currentLineX + width + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + width + xOffset);
              }else{
                verticalLines[i].getPoints()[0].x = (currentLineX + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + xOffset);
              }
            }
          }
        }
        for(i = 0; i < horizontalLines.length; i++){
          currentLineY = horizontalLines[i].getPoints()[0].y;
          if(yOffset!=0){
            if(yOffset > 0){//subindo
              if(currentLineY + yOffset > height/2){//ta no topo
                horizontalLines[i].getPoints()[0].y = (currentLineY - height + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY - height + yOffset);
              }else{
                horizontalLines[i].getPoints()[0].y = (currentLineY + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + yOffset);
              }
            }else{//descendo
              if(currentLineY + yOffset < -height/2){//ta lá embaixo
                horizontalLines[i].getPoints()[0].y = (currentLineY + height + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + height + yOffset);
              }else{
                horizontalLines[i].getPoints()[0].y = (currentLineY + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + yOffset);
              }
            }
          }
        }
      }

      function drawAxis(){
        var xAxis = new Kinetic.Line({
          points: [-normalWidth/2, 0.5, normalWidth/2, 0.5],
          stroke: 'black',
          strokeWidth: 1
        });
        var yAxis = new Kinetic.Line({
          points: [0+0.5, -normalHeight/2, 0+0.5, normalHeight/2],
          stroke: 'black',
          strokeWidth: 1
        });
        axis.push(xAxis);
        axis.push(yAxis);
        axisLayer.add(yAxis);
        axisLayer.add(xAxis);
      }

      function drawText(offset, width, height){
        for(var i = 0; i <= width/2; i+=offset){
          if(i!=width/2 && i != 0){
            var text1 = new Kinetic.Text({
              x: i+3,
              y: 2,
              text: ""+i/offset+"",
              fontSize: 14,
              fontFamily: 'Helvetica',
              fill: 'black'
            });
            xTextLabels.push(text1);
            textLayer.add(text1);
          }
          var text2 = new Kinetic.Text({
              x: -i+3,
              y: 2,
              text: ""+((-i)/offset)+"",
              fontSize: 14,
              fontFamily: 'Helvetica',
              fill: 'black'
            });
            xTextLabels.push(text2);
            textLayer.add(text2);
        }
        for(var i = 0; i <= height/2; i+=offset){
          if(i != height/2){
            var text1 = new Kinetic.Text({
              x: 8,
              y: i,
              text: ""+((-i)/offset)+"",
              fontSize: 14,
              fontFamily: 'Helvetica',
              fill: 'black'
            });
            if(i == 0){
              text1.hide();
            }
            yTextLabels.push(text1);
            textLayer.add(text1);
          }
          if(i != 0){
          var text2 = new Kinetic.Text({
              x: 8,
              y: -i,
              text: ""+i/offset+"",
              fontSize: 14,
              fontFamily: 'Helvetica',
              fill: 'black'
            });
          yTextLabels.push(text2);
          textLayer.add(text2);
          }
        }
      }

      function reDrawText(xOffset, yOffset){
        if(xOffset != 0 && !isYBlocked){
          for(var i = 0; i < xTextLabels.length; i++){
            var textPositionX = parseInt(xTextLabels[i].getAttr('x'));
            var textValue = parseInt(xTextLabels[i].getAttr('text'));
            if(xOffset > 0){ // ta indo para a direita
              if(textPositionX + xOffset >= normalWidth/2){//ta no limite direito...
                xTextLabels[i].setAttr('x', textPositionX + xOffset - normalWidth);
                xTextLabels[i].setAttr('text', textValue - normalWidth/100);
              }else{
                xTextLabels[i].setAttr('x', textPositionX + xOffset);
              }
            } else { // esquerda
              if(textPositionX + xOffset < -normalWidth/2){//ta no limite esquerdo...
                xTextLabels[i].setAttr('x', textPositionX + xOffset + normalWidth);
                xTextLabels[i].setAttr('text', textValue + normalWidth/100);
              }else{
                xTextLabels[i].setAttr('x', textPositionX + xOffset);
              }
            }     
          }
          for(var i = 0; i < yTextLabels.length; i++){
            var textPositionX = parseInt(yTextLabels[i].getAttr('x'));
            //tenho que ver como limitar =/
            if(xOffset > 0){ //direita
              yTextLabels[i].setAttr('x', textPositionX + xOffset);
            } else { //esquerda
              yTextLabels[i].setAttr('x', textPositionX + xOffset);
            }
          }
        }
        if(yOffset != 0 && !isXBlocked){
          for(var i = 0; i < yTextLabels.length; i++){
            var textPositionY = parseInt(yTextLabels[i].getAttr('y'));
            var textValue = parseInt(yTextLabels[i].getAttr('text'));
            if(yOffset > 0){ // ta indo para cima
              if(textPositionY + yOffset > normalHeight/2){//ta no limite superior...
                yTextLabels[i].setAttr('y', textPositionY + yOffset - normalHeight);
                yTextLabels[i].setAttr('text', textValue + normalHeight/100);
              }else{
                yTextLabels[i].setAttr('y', textPositionY + yOffset);
              }
            } else { // esquerda
              if(textPositionY + yOffset < -normalHeight/2){//ta no limite inferior...
                yTextLabels[i].setAttr('y', textPositionY + yOffset + normalHeight);
                yTextLabels[i].setAttr('text', textValue - normalHeight/100);
              }else{
                yTextLabels[i].setAttr('y', textPositionY + yOffset);
              }
            }
            if(yTextLabels[i].getAttr('text') == '0'){
              yTextLabels[i].hide();
            } else {
              yTextLabels[i].show();
            }     
          }
          for(var i = 0; i < xTextLabels.length; i++){
            var textPositionY = parseInt(xTextLabels[i].getAttr('y'));
            //tenho que ver como limitar =/
            if(yOffset > 0){ //direita
              xTextLabels[i].setAttr('y', textPositionY + yOffset);
            } else { //esquerda
              xTextLabels[i].setAttr('y', textPositionY + yOffset);
            }
          }
        }
      }
      var chart = null;

      

      function drawChart(params){
          var latex = $("#bla").mathquill('latex');
          var calc = new Calc(latex);
          var points = [];
          //console.log(" >> "+((-normalWidth/2)+cumulatedXOffset));
          for(var i=(-normalWidth/2)-Math.abs(cumulatedXOffset); i<(normalWidth/2)+Math.abs(cumulatedXOffset); i+=2){
            params.x = i*scale;
            points.push(params.x/scale);
            var y = calc.eval(params)/scale;//+(h/2);
            y = -y;
            points.push(y);
          }
          if(chart!=null){
            chart.remove();
            chartLayer.clear();
          }
          chart = new Kinetic.Line({
            points: points,
            stroke: 'red',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
          });
          chartLayer.add(chart);
          stage.draw();
        }

      $(function(){
        scale = 1/100;
        isDragging = false;
        cartesianWidth = $("#cartesianPlane").width();
        cartesianHeight = $(window).height(); //removing padding
        normalWidth = cartesianWidth - (cartesianWidth%100) + 100;
        normalHeight = cartesianHeight - (cartesianHeight%100) + 100;
        stage = new Kinetic.Stage({
          container: 'cartesianPlane',
          width: normalWidth,
          height: normalHeight,
          draggable: false,
          x: normalWidth/2,
          y: normalHeight/2,
        });

        //init arrays
        smallerVerticalLines = [];
        biggerVerticalLines = [];
        smallerHorizontalLines = [];
        biggerHorizontalLines = [];
        axis = [];
        xTextLabels = [];
        yTextLabels = [];
        isYBlocked = false;
        isXBlocked = false;
        cumulatedYOffset = 0;
        cumulatedXOffset = 0;

        //initLayers
        textLayer = new Kinetic.Layer();
        smallerGridLayer = new Kinetic.Layer();
        initLines(smallerGridLayer,smallerVerticalLines, smallerHorizontalLines, 20, normalWidth, normalHeight, '#333333');
        biggerGridLayer = new Kinetic.Layer();
        initLines(biggerGridLayer,biggerVerticalLines, biggerHorizontalLines, 100, normalWidth, normalHeight, '#777777');
        axisLayer = new Kinetic.Layer();

        chartLayer = new Kinetic.Layer();

        drawAxis();
        drawText(100, normalWidth, normalHeight);
        stage.add(textLayer);
        stage.add(smallerGridLayer);
        stage.add(biggerGridLayer);
        stage.add(axisLayer);
        stage.add(chartLayer);

        $('body').on('touchmove', function(e){
          e.preventDefault();
        });
        
        stage.on('contentMousedown contentTouchstart contentTap contentDbltap', function(evt){
          isDragging = true;
          lastCursorX = stage.getPointerPosition().x;
          lastCursorY = stage.getPointerPosition().y;
          
        });  
        stage.on('contentMouseup contentTouchend', function(evt){
          isDragging = false;
          
        });
        stage.on('contentMousemove contentTouchmove', function(evt){
          if(isDragging){
            var xOffset = stage.getPointerPosition().x - lastCursorX;
            var yOffset = stage.getPointerPosition().y - lastCursorY;
            
            /* COMECO DE TESTE TOSCO */
            cumulatedXOffset += xOffset;
            cumulatedYOffset += yOffset;
            if(xOffset >= normalWidth/2 - 5 || xOffset <= -normalWidth/2 + 5){
              isXBlocked = true;
            }else{
              isXBlocked = false;
            }
            if(yOffset >= normalHeight/2 - 5 || yOffset <= -normalHeight/2 + 5){
              isYBlocked = true;
            } else {
              isYBlocked = false;
            }
            /* FINAL DE TESTE TOSCO */
            reDrawGrid(normalWidth, normalHeight, xOffset, yOffset, smallerHorizontalLines, smallerVerticalLines, smallerGridLayer);
            reDrawGrid(normalWidth, normalHeight, xOffset, yOffset, biggerHorizontalLines, biggerVerticalLines, biggerGridLayer);
            reDrawAxis(xOffset, yOffset);
            reDrawText(xOffset, yOffset);
            textLayer.batchDraw();
            smallerGridLayer.batchDraw();
            biggerGridLayer.batchDraw();
            axisLayer.batchDraw();

            //console.log(cumulatedXOffset+","+cumulatedYOffset);
            //stage.draw();

            var scope = angular.element($("#MainCtrl")).scope();
            scope.updateParams();
          }
          lastCursorX = stage.getPointerPosition().x;
          lastCursorY = stage.getPointerPosition().y;
          
          chartLayer.move(xOffset, yOffset);
          chartLayer.draw();

        });
        stage.draw();
      
        $(window).resize(function(){
          $("#cartesianPlane").height($(window).height());
        });
        $("span.keyboard").click(function(){
          $('#bla').mathquill($(this).attr("data-cmd"),$(this).attr("data-value"));
          //$('#bla').Cursor($(this).attr("data-cmd"),$(this).attr("data-value"));
        });
        $("#iconeCaret").hide();
        $(".keyboardCont").hide();
        $("#keyboardToggle").click(function(){
          $(".keyboardCont").slideToggle();
          $("#iconeCaret").toggle();
          $("#iconeCaret2").toggle();
          return false;
        });

        $(".closeToolbar .i2").hide();
        $(".closeToolbar a").click(function(){
          if($(".toolbar").css("left")=="0px"){
            $(".toolbar").animate({ left: 0-$(".toolbar").width() });
            $(".closeToolbar .i1").hide();
            $(".closeToolbar .i2").show();
          }else{
            $(".toolbar").animate({ left: 0 });
            $(".closeToolbar .i2").hide();
            $(".closeToolbar .i1").show();
          }
          
          return false;
        });

        var latexMath = $("#bla");
        latexMath.bind('keydown keypress', function() {
          setTimeout(function() {
            var latex = latexMath.mathquill('latex');
            var scope = angular.element($("#MainCtrl")).scope();
            scope.updateParams();
          });
        }).keydown().focus();

        FastClick.attach(document.body);

      });