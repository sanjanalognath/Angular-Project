var app = angular.module("myApp", ['ngRoute']);
var loggedIn="";

app.config(function($routeProvider) {
	
	$routeProvider.when('/',{
        templateUrl:'user_login.html',
        controller:'loginController'
     	})
	.when('/sign_up',{
        templateUrl:'sign_up.html',
        controller:'signController'
        
     })
	.when('/home',{
        templateUrl:'home.html',
        controller:'homecntrl'
        
     })
	.when('/profiles',{
        templateUrl:'profiles.html',
        controller:'profilescntrl'
        
     })
	.when('/message/:index',{
		templateUrl:'message.html',
		controller:'msgdetcontroller'
	})
	.when('/reply/:index',{
		templateUrl:'reply.html',
		controller:'replyController'
	})
	.when('/messagelist',{
		templateUrl:'messagelist.html',
		controller:'msgController'
	})

	
});

app.factory('authService', function()
{
	return {
		current_user: ""
	}
})
	


app.controller('loginController', function($scope,$location,authService){
	$scope.authform = {};
	$scope.login = function() {
		if(!$scope.authform.username || $scope.authform.username=='' || !$scope.authform.pwd || $scope.authform.pwd=='')
		{
			
			alert("please enter valid details");
			return false;
		}
		else {
			var users=[];
	    	if(localStorage.a_users)
				{
				users=JSON.parse(localStorage.a_users)
				console.log(users);
				for(i=0; i<users.length; i++){
					if(users[i].username==$scope.authform.username && users[i].pwd== $scope.authform.pwd)
					{
							loggedIn = users[i].username;
							authService.current_user= loggedIn;
							alert(users[i].username);
							localStorage.isLoggedIn=true;
							$location.path("/home");
							return true;
					}
				}
			}
		}

		alert("username/password did not match");
		return false;		
	}
	$scope.sign = function(){
	$location.path("/sign_up");
}

}); 

app.controller('homecntrl', function($scope, authService){

	$scope.logout = function()
	{
		authService.current_user = ""
	}
})




app.controller('signController', function($scope, $location){
      	$scope.authform ={};
      	$scope.signup=function(){
      		
   		var users=[];
        if(localStorage.a_users)
			{
				users=JSON.parse(localStorage.a_users)
        		console.log(users);
    		}
        var user = {
        'Username': username,
        'Password': pwd,
        'Firstname': firstname,
        'Lastname': lastname,
        'Email' : email,
        'Phone': phone,
        'Location': location,
   			}
        users.push($scope.authform);
        localStorage.a_users = JSON.stringify(users);
	        
        }

        $scope.previous = function(){
	        $location.path("/");
        	 
        }
 });


app.controller('msgController', function($scope, authService){
	
	$scope.msgs = JSON.parse(localStorage.msgs).filter(m => !m.delete  && m.recipient === authService.current_user);

});


app.controller('profilescntrl',  function($scope, authService){
	var users=[];
    if(localStorage.a_users)
		{
			users=JSON.parse(localStorage.a_users)
    		console.log(users);
		}
		$scope.authform = users.find(u => u.username === authService.current_user)
	$scope.update = function(){

		
      //   var user = {
      //   'Username': username,
      //   'Password': pwd,
      //   'Firstname': firstname,
      //   'Lastname': lastname,
      //   'Email' : email,
      //   'Phone': phone,
      //   'Location': location,
   			// }
      //   users.push($scope.authform);
      console.log($scope.authform, users)
        localStorage.a_users = JSON.stringify(users);
	        
        

	}
	
})

   
app.controller('msgdetcontroller', function($scope, $routeParams,$location,authService)
{
$scope.index = $routeParams.index;
$scope.msgs = JSON.parse(localStorage.msgs);
$scope.message = $scope.msgs.filter(m => !m.delete && m.recipient === authService.current_user)[$scope.index];

$scope.back = function(){

$location.path("/messagelist");

}

$scope.important = function(){
	$scope.message.important = 1;
	localStorage.msgs =  JSON.stringify($scope.msgs);
}

$scope.delete = function(){
	$scope.message.delete = 1;
	localStorage.msgs =  JSON.stringify($scope.msgs);
	$location.path("/messagelist");
}
$scope.Reply = function() {
$location.path("/reply/" + $scope.index);

}
});


	
app.controller('replyController',  function($scope, $routeParams,$location,authService){
	$scope.index = $routeParams.index;
	$scope.msgs = JSON.parse(localStorage.msgs);
	$scope.message = $scope.msgs.filter(m => !m.delete && m.recipient === authService.current_user)[$scope.index];

	$scope.submit = function()
	{
		var obj = {
            "recipient":$scope.message.sender,
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":$scope.message.recipient,
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"Re: " + $scope.message.title,
            "description": $scope.reply,
            "created_at": new Date(),
            "important":"0"
		}
		$scope.msgs.push(obj);
	localStorage.msgs =  JSON.stringify($scope.msgs);

	$location.path("/messagelist");

	}

	
})
    
 
function storage()
{
	localStorage.msgs =  JSON.stringify([
        {
            "recipient":"samy",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"User 2",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"This is a sample message to User 1.",
            "description":"This is a sample description to the message which has the above title",
            "created_at":"2017-01-19 09:45:00",
            "important":"0"
        },
        {
            "recipient":"User 2",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"User 3",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"This is a sample message to User 1.",
            "description":"This is a sample description to the message which has the above title",
            "created_at":"2017-01-19 09:45:00",
            "important":"0"
        }
]);
}

