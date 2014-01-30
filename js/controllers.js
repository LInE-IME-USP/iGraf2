function MainCtrl($scope, $timeout){
	$scope.parameters= {
	};
    $scope.isAnimatingParams = false;
    
    $scope.$watch('parameters', function(newValue){
        if(!$scope.isAnimatingParams){
            var ps = {};
            angular.forEach($scope.parameters, function(value, key){
                ps[key] = value.currentValue;
            });
            drawChart(ps);
        }
    }, true);

    $timeout(function somework(){
        if($scope.isAnimatingParams){
            var ps = {};
            angular.forEach($scope.parameters, function(value, key){
                if(value.ending==parseInt(value.currentValue) && value.step>0){
                    value.step = value.step*-1;

                }else if(value.starting==parseInt(value.currentValue) && value.step<0){
                    value.step = value.step*-1;
                }
                $scope.parameters[key].currentValue+=value.step;
                ps[key] = value.currentValue;
            });
            drawChart(ps);
        }else{
            var ps = {};
            var draw = false;
            angular.forEach($scope.parameters, function(value, key){
                if(value.animating){
                    if(value.ending==parseInt(value.currentValue) && value.step>0){
                        value.step = value.step*-1;

                    }else if(value.starting==parseInt(value.currentValue) && value.step<0){
                        value.step = value.step*-1;
                    }
                    $scope.parameters[key].currentValue+=value.step;
                    ps[key] = value.currentValue;
                    draw = true;
                }
            });
            if(draw){
                drawChart(ps);
            }
        }
        $timeout(somework, 75);
    }, 500);

    $scope.animateThis = function(p){
        p.animating = true;
    }
    $scope.stopAnimateThis = function(p){
        p.animating = false;
    }

	$scope.updateParams = function(){
	    var latex = $("#bla").mathquill('latex');
        //console.log(latex);
        var calc = new Calc(latex);
        var ps = calc.params();
        angular.forEach(ps, function(value, key){
        	if(value!="x"){
                	if(!(value in $scope.parameters)){
                        var initial = 0;
                        if(value=="a"){
                            initial = 1;
                        }
                		$scope.parameters[value] = {
                			name: value,
                			starting: -10,
                			ending: 10,
                            currentValue: initial,
                            step: 0.1,
                            animating: false
                		};
                	}
                }
        });
        angular.forEach($scope.parameters, function(value, key){
                if(ps.indexOf(value.name)<0){
                        delete $scope.parameters[key];
                }
        });
        $scope.$apply();

        var ps = {};
        angular.forEach($scope.parameters, function(value, key){
            ps[key] = value.currentValue;
        });
        drawChart(ps);

        //$scope.parameters = calc.params();
	}

    $scope.size = function(obj){
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
}