import React from "react";
import $ from "jquery";
import axios from "axios";
import Navbar from "./navbar";
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi'

export default class Pemesanan extends React.Component {
    constructor() {
        super()
        this.state = {
            menu: [],
            meja: [],
            action: "",
            token: "",
            id_transaksi: 0,
            tgl_transaksi: '',
            id_user: 0,
            id_meja: 0,
            nama_pelanggan: '',
            status: '',
            jenis_pesanan: '',
            cart: [],
            id_menu: [],
            qty: []
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
    getMenu = () => {
        let url = "http://localhost:4040/kasir_kafe/menu/"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ menu: response.data.data })
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

    getUser = () => {
        let url = "http://localhost:4040/kasir_kafe/user"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ user: response.data.data })
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

    getMeja = () => {
        let url = "http://localhost:4040/kasir_kafe/meja"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ meja: response.data.data })
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
        $("#modal_transaksi").show()
        let user = JSON.parse(localStorage.getItem('user'))
        this.setState({
            id_transaksi: 0,
            tgl_transaksi: '',
            id_meja: 0,
            id_user: user.id_user,
            nama_pelanggan: '',
            status: 'belum_bayar',
            jenis_pesanan: '',
            action: "insert",
        })
    }
    AddDetail = (value, index) => {
        axios
            .get("http://localhost:4040/kasir_kafe/menu/" + value.id_menu, this.headerConfig())
            .then((res) => {
                console.log(res.data.data)
                console.log("id menu: " + this.state.menu[index].id_menu)
                console.log("index: " + index)
                console.log("panjang cart: " + this.state.cart.length)
                console.log("qty index " + this.state.cart[index])
                let i = this.state.cart.indexOf()
                console.log(i)
                // const keranjang ={
                //     id_menu: value.id_menu,
                //     qty: 1
                // }
                // this.setState({
                //     cart: keranjang
                // })
                // for (let i = 0; i < menus.length; i++) {
                if (this.state.cart.length === 0) {
                    const keranjang = {
                        id_menu: value.id_menu,
                        qty: 1
                    }
                    this.state.cart.push(keranjang)
                } else if (this.state.cart.find(item => item.id_menu === value.id_menu)) {
                    this.state.cart.find(item => item.id_menu===value.id_menu).qty++
                } else if (this.state.cart.find(item => item.id_menu !== value.id_menu)) {
                    const keranjang = {
                        id_menu: value.id_menu,
                        qty: 1
                    }
                    this.state.cart.push(keranjang)
                }
                console.log(this.state.cart)
                // }
            })
            .catch(error => console.log(error))

    };

    Edit = selectedItem => {
        $("#modal_transaksi").show()
        this.setState({
            action: "update",
            id_transaksi: selectedItem.id_transaksi,
            status: selectedItem.status,
        })
    }
    saveTransaksi = (event) => {
        event.preventDefault()
        $("#modal_transaksi").show()
        let sendData = {
            id_transaksi: this.state.id_transaksi,
            tgl_transaksi: this.state.tgl_transaksi,
            id_user: this.state.id_user,
            id_meja: this.state.id_meja,
            nama_pelanggan: this.state.nama_pelanggan,
            status: this.state.status,
            jenis_pesanan: this.state.jenis_pesanan,
            detail_transaksi: this.state.cart
        }
        let url = "http://localhost:4040/kasir_kafe/pemesanan"
        if (this.state.action === "insert") {
            axios.post(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.setState({ transaksi: response.data.data })
                })
        } else if (this.state.action === "update") {
            axios.put(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTransaksi()
                })
                .catch(error => console.log(error))
        }
        $("#modal_transaksi").hide()
    }
    dropTransaksi = selectedItem => {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let url = "http://localhost:4040/kasir_kafe/pemesanan/" + selectedItem.id_transaksi
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
        this.getMenu()
        this.getMeja()
    }
    close = () => {
        $("#modal_transaksi").hide()
    }

    convertToRupiah(number) {

        if (number) {

            var rupiah = "";

            var numberrev = number

                .toString()

                .split("")

                .reverse()

                .join("");

            for (var i = 0; i < numberrev.length; i++)

                if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";

            return (

                "Rp. " +

                rupiah

                    .split("", rupiah.length - 1)

                    .reverse()

                    .join("")

            );

        } else {

            return number;

        }

    }

    render() {
        return (
            <div className='flex h-screen w-full'>
                <div class="w-full h-screen">
                    <Navbar />
                    <div class=" relative mt-20 overflow-x-auto shadow-md sm:rounded-lg m-2">
                        <h2 className="dark:text-white mb-6 text-xl font-sans ml-3 mt-1">Daftar Menu
                            <button className="hover:bg-green-500 float-right mr-3 bg-green-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" type="button" onClick={() => this.Add()}>
                                Pesan
                            </button>
                        </h2>
                        <div className="grid grid-cols-4">
                            {this.state.menu.map((item, index) => (
                                <div class="max-w-sm bg-white border m-3 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" key={index}>
                                    <img class="rounded-t-lg" src={`http://localhost:4040/img/${item.gambar}`} alt="gambar" />
                                    <div class="p-5">
                                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.nama_menu}</h5>
                                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Jenis: {item.jenis}</p>
                                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Deskripsi: {item.deskripsi}</p>
                                        <p class="mb-6 font-normal text-gray-700 dark:text-gray-400">Harga: {this.convertToRupiah(item.harga)}</p>

                                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            <HiOutlineMinus><span class="sr-only">Kurang</span></HiOutlineMinus>
                                        </button>
                                            <button type="button" onClick={() => this.AddDetail(item, index)} class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <HiOutlinePlus><span class="sr-only">Tambah</span></HiOutlinePlus>
                                            </button>
                                        <div class="relative float-right inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-700">
                                            <span class="font-medium text-gray-200 ">{this.state.qty[index]}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Modal */}
                <div id="modal_transaksi" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.close()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Pemesanan</h3>
                                <form class="space-y-6" onSubmit={(event) => this.saveTransaksi(event)}>
                                    <div>
                                        <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Pelanggan</label>
                                        <input type="text" name="nama_pelanggan" id="nama_pelanggan" value={this.state.nama_pelanggan} onChange={this.bind} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Masukkan nama pelanggan" required />
                                    </div>
                                    <div>
                                        <label for="jenis" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Pesanan</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Jenis Pesanan" name="jenis_pesanan" value={this.state.jenis_pesanan} onChange={this.bind} required>
                                            <option value=''>Pilih Jenis Pesanan</option>
                                            <option value="ditempat">Makan Ditempat</option>
                                            <option value="dibungkus">Dibungkus</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="jenis" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Meja</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Jenis Pesanan" name="id_meja" value={this.state.id_meja} onChange={this.bind} required>
                                            <option value="">Pilih Meja</option>
                                            {this.state.meja.map(item => (
                                                <option value={item.id_meja}>{item.nomor_meja}: {item.status_meja}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}