import './signup.html'

if (Meteor.isClient) {
  Template.signup.events({
    'submit form': function(event, template) {
        event.preventDefault();
        console.log('creating acjkcount');
        var passwordVar = template.find('#password').value;
        var confirmVar = template.find('#confirmPassword').value;
        if (passwordVar === confirmVar) {
            Accounts.createUser({
                email: template.find('#email').value,
                password: passwordVar,
                // you can add wherever fields you want to profile
                // you should run some validation on values first though
                profile: {
                  firstName: template.find('#firstName').value,
                  lastName: template.find('#lastName').value,
                  powerofsign : 1
                }
            });
        }
    }
  });
}