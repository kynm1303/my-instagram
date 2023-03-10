import React, { Component, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import * as firebase from 'firebase';
import { container, form } from '../styles';

const Login = function (props) {
    const [email, setEmail] = useState('test@gmail.com');
    const [password, setPassword] = useState('123456');

    const handleSignIn = function () {
        console.log("Sign in", email, password);
        firebase.auth().signInWithEmailAndPassword(email, password)
    }
    return (
        <View style={container.center}>
            <View style={container.formCenter}>
                <TextInput
                    style={form.textInput}
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={form.textInput}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <Button
                    style={form.button}
                    onPress={() => handleSignIn()}
                    title="Sign In"
                />
            </View>


            <View style={form.bottomButton} >
                <Text
                    title="Register"
                    onPress={() => props.navigation.navigate("Register")} >
                    Don't have an account? SignUp.
                </Text>
            </View>
        </View>
    )
}

export default Login;