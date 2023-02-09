import React from "react";
import $ from "jquery";
import axios from "axios";

export default class Pemesanan extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [],
            detail_transaksi: [],
            action: "",
            token: "",
            tgl_transaksi: '',
            id_user: 0,
            id_meja: 0,
            nama_pelanggan: '',
            status: '',
            jenis_pesanan: '',
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/"
        }
    }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }
    getTransaksi = () => {
        let url = "http://localhost:4040/kasir_kafe/pemesanan"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ transaksi: response.data.data })
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status) {
                        window.alert(error.response.data.message)
                        window.location = '/'
                    }
                } else {
                    console.log(error);
                }
            })
    }

    getDetailTransaksi = () => {
        let url = "http://localhost:4040/kasir_kafe/pemesanan/detail"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ detail_transaksi: response.data.data })
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status) {
                        window.alert(error.response.data.message)
                        window.location = '/'
                    }
                } else {
                    console.log(error);
                }
            })
    }

    Add = () => {
        $("#modal_user").show()
        this.setState({
            id_user: 0,
            nama_user: "",
            role: "",
            username: "",
            password: "",
            fillpassword: true,
            action: "insert"
        })
    }
    Edit = selectedItem => {
        $("#modal_user").show()
        this.setState({
            action: "update",
            id_user: selectedItem.id_user,
            nama_user: selectedItem.nama_user,
            role: selectedItem.role,
            username: selectedItem.username,
            password: selectedItem.password,
            fillpassword: false
        })
    }
    saveUser = (event) => {
        event.preventDefault()
        $("#modal_user").show()
        let sendData = {
            id_user: this.state.id_user,
            nama_user: this.state.nama_user,
            role: this.state.role,
            username: this.state.username,
            password: this.state.password,
        }
        let url = "http://localhost:4040/kasir_kafe/user"
        if (this.state.action === "insert") {
            axios.post(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getUser()
                })
        } else if (this.state.action === "update") {
            axios.put(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getUser()
                })
                .catch(error => console.log(error))
        }
        $("#modal_user").hide()
    }
    dropUser = selectedItem => {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let url = "http://localhost:4040/kasir_kafe/user/" + selectedItem.id_petugas
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getUser()
                })
                .catch(error => console.log(error))
        }
    }
    bind = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    componentDidMount() {
        this.getTransaksi()
        this.getDetailTransaksi()
    }
    close = () => {
        $("#modal_user").hide()
    }
    Logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("petugas")
        window.location = "/"
    }
    render() {
        return (
            <div className='flex h-screen'>
                <div class="p-5 w-full bg-gray-100">
                    <h1 class="text-xl mb-2 font-bold">Tabel User</h1>
                    <button className="bg-red-600 text-white active:bg-green-400 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => this.Logout()}>
                        Keluar
                    </button>
                    <div class="overflow-auto rounded-lg shadow hidden md:block">
                        <table class="w-full table-auto">
                            <thead class="bg-gray-50 border-b-2 border-gray-200">
                                <tr align='center'>
                                    <th class="w-24 p-3 text-sm font-semibold tracking-wide">Nama</th>
                                    <th class="w-24 p-3 text-sm font-semibold tracking-wide">Jabatan</th>
                                    <th class="w-24 p-3 text-sm font-semibold tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {this.state.user.map(item => (
                                    <tr class="bg-white" align='center' key={item.id_user}>
                                        <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{item.nama_user}</td>
                                        <td class="p-3 text-sm text-gray-700 whitespace-nowrap">{item.role}</td>
                                        <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                                            <button className="bg-purple-600 text-white active:bg-purple-400 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => this.Edit(item)}>
                                                Edit
                                            </button>
                                            <button className="bg-red-600 text-white active:bg-red-400 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => this.dropUser(item)}>
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <button className="bg-green-600 text-white active:bg-green-400 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => this.Add()}>
                                Tambah Petugas
                            </button>
                        </td>
                    </div>
                </div>
                <div id="modal_user" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class=" w-full overflow-scroll flex h-screen p-4 justify-center" >
                        <div class="bg-white py-6 px-10 sm:max-w-md w-full rounded-2xl">
                            <div class="sm:text-3xl text-2xl font-bold font-sans text-center text-blue-400 mb-12">
                                User
                            </div>
                            <form >
                                <div>
                                    <input type="text" class="focus:outline-none border-b w-full pb-2 border-sky-400 text-gray-500 placeholder-gray-500 mb-8" placeholder="Nama" name="nama_user" value={this.state.nama_user} onChange={this.bind} />
                                </div>
                                <div>
                                    <select className="focus:outline-none border-b w-full pb-2 border-sky-400 text-gray-500 placeholder-gray-500 mb-8" placeholder="Role" name="role" value={this.state.role} onChange={this.bind}>
                                        <option value="">Pilih Role</option>
                                        <option value="manajer">Manajer</option>
                                        <option value="admin">Admin</option>
                                        <option value="kasir">Kasir</option>
                                    </select>
                                </div>
                                <div>
                                    <input type="text" class="focus:outline-none border-b w-full pb-2 border-sky-400 text-gray-500 placeholder-gray-500 mb-8" placeholder="Username" name="username" value={this.state.username} onChange={this.bind} />
                                </div>
                                <div>
                                    <input type="password" class="focus:outline-none border-b w-full pb-2 border-sky-400 text-gray-500 placeholder-gray-500 mb-8" placeholder="Password" name="password" value={this.state.password} onChange={this.bind} />
                                </div>
                                <div className="row" align="center">
                                    <button class=" rounded-3xl p-3 mr-8 w-full sm:w-40   bg-gradient-to-r from-red-600 via-red-500 to-red-300 text-white text-lg font-semibold " onClick={() => { this.close() }}>
                                        Tutup
                                    </button>
                                    <button class=" rounded-3xl  p-3 w-full sm:w-40   bg-gradient-to-r to-teal-400 from-teal-300 text-white text-lg font-semibold" type="submit" onClick={ev => this.saveUser(ev)}>
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}