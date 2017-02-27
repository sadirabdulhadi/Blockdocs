import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Meteor.startup(function(){
//     // Show the example modal 3 seconds after startup.
//     setTimeout(function(){
//         Modal.show('modal')
//     })
// })

Template.modal.events({
      'click #button': function () {
    // you can also provide the modal with a dataContext if needed
    Blaze.renderWithData(Template.toBeRenderedTemplate, {yourdata} , document.body );
        $('#yourModal').modal('show');
      }
    });

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
        Router.go('home');
    }
});

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
    }
});

Meteor.loginWithPassword(email, password, function(error){
    if(error){
        console.log(error.reason);
    } else {
        Router.go("main");
    }
});

Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});



