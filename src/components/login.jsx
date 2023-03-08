import React from 'react';
import axios from 'axios';
import logo from "../assets/coffee.gif"

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            role: "",
            message: "",
            logged: true
        }
    }
    bind = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleLogin = event => {
        event.preventDefault()
        let sendData = {
            username: this.state.username,
            password: this.state.password
        }
        let url = "http://localhost:4040/kasir_kafe/user/login"
        axios.post(url, sendData)
            .then(res => {
                this.setState({ logged: res.data.logged })
                if (this.state.logged) {
                    let user = res.data.data
                    let token = res.data.token
                    localStorage.setItem("user", JSON.stringify(user))
                    localStorage.setItem("token", token)
                    this.state.role = user.role

                    if (this.state.role === "admin") {
                        window.location = '/admin/menu'
                    } else if (this.state.role === "kasir") {
                        window.location = '/kasir/pemesanan'
                    } else if (this.state.role === "manajer") {
                        window.location = '/manajer'
                    }
                }
                else {
                    window.alert(res.data.message)
                }
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div class="py-6 mt-12">
                <a href="#" class="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-600">
                    <img class="w-8 h-8 mr-2" src={logo} alt="logo" />
                    Wiku Cafe Shop
                </a>
                <div class="flex dark:bg-gray-800 text rounded-lg shadow-lg shadow-gray-500 overflow-hidden mx-auto max-w-sm lg:max-w-xl">
                    <div class="w-full p-6 text-gray-600">
                        <h2 class="text-3xl font-semibold text-center">Masuk</h2>
                        <p class="text-xl  text-center">Selamat Datang!</p>

                        <form className="mt-6" onSubmit={ev => this.handleLogin(ev)}>
                            <div class="mt-4">
                                <label class="block  text-sm font-bold mb-2">Username</label>
                                <input
                                    id="username" name="username" placeholder="Masukkan Username" onChange={this.bind} value={this.state.username} required
                                    class="bg-gray-200 text-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="text" />
                            </div>
                            <div class="mt-4">
                                <div class="flex justify-between">
                                    <label class="block text-sm font-bold mb-2">Password</label>
                                </div>
                                <input
                                    id="password"
                                    name="password" placeholder="Password" onChange={this.bind} value={this.state.password} required
                                    class="bg-gray-200 text-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password" />
                            </div>
                            <div class="mt-8">
                                <button class="bg-gray-700 text-gray-300 font-bold py-2 px-4 w-full rounded hover:bg-gray-600">Masuk</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}