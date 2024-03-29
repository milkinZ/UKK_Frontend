import React from "react";
import $ from "jquery";
import axios from "axios";
import Navbar from "./navbar";

export default class Meja extends React.Component {
    constructor() {
        super()
        this.state = {
            meja: [],
            action: "",
            token: "",
            id_meja: 0,
            nomor_meja: "",
            status_meja: ""
        }
        let user = JSON.parse(localStorage.getItem('user'))
        if (localStorage.getItem("token") && user.role ==="admin") {
            this.state.token = localStorage.getItem("token")
        } else {
            window.alert("Maaf, anda bukan admin")
            window.location = "/"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }
    
    getMeja = () => {
        $("#dropdown").hide()
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

    getMejaStatus = (status) => {
        $("#dropdown").hide()
        let url = "http://localhost:4040/kasir_kafe/meja/status/" + status
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
        $("#modal_meja").show()
        $("#status").hide()
        this.setState({
            id_meja: 0,
            nomor_meja: "",
            status_meja: "",
            action: "insert"
        })
    }
    Edit = selectedItem => {
        $("#modal_meja").show()
        $("#status").show()
        this.setState({
            action: "update",
            id_meja: selectedItem.id_meja,
            nomor_meja: selectedItem.nomor_meja,
            status_meja: selectedItem.status_meja
        })
    }
    saveMeja = (event) => {
        event.preventDefault()
        $("#modal_meja").show()
        let sendData = {
            id_meja: this.state.id_meja,
            nomor_meja: this.state.nomor_meja,
            status_meja: this.state.status_meja
        }
        let url = "http://localhost:4040/kasir_kafe/meja"
        if (this.state.action === "insert") {
            axios.post(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    window.location.reload()
                    this.getMeja()
                })
        } else if (this.state.action === "update") {
            axios.put(url, sendData, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    window.location.reload()
                    this.getMeja()
                })
                .catch(error => console.log(error))
        }
        $("#modal_meja").hide()
    }
    dropMeja = selectedItem => {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let url = "http://localhost:4040/kasir_kafe/meja/" + selectedItem.id_meja
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    window.location.reload()
                    this.getMeja()
                })
                .catch(error => console.log(error))
        }
    }
    bind = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    componentDidMount() {
        this.getMeja()
    }
    status = () => {
        var x = document.getElementById("dropdown");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    }
    close = () => {
        $("#modal_meja").hide()
    }
    render() {
        return (
            <div className='flex h-screen w-full'>
                <div class="w-full h-screen">
                    <Navbar />
                    <div class="relative mt-20 overflow-x-auto shadow-md sm:rounded-lg m-2">
                        <h2 className="dark:text-white text-lg font-sans mb-2">Daftar Meja
                            <button className="hover:bg-green-500 float-right bg-green-600 text-white font-bold uppercase text-xs px-4 py-3 mb-2 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" type="button" onClick={() => this.Add()}>
                                Tambah Meja
                            </button>
                        </h2>
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Nomor Meja
                                    </th>
                                    <th scope="col" class="px-6 py-3 flex items-center">
                                        Status Meja
                                        <a href="#" onClick={() => this.status()} id="ikon1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                    </th>
                                    <div id="dropdown" class="z-10 hidden fixed bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                            <li>
                                                <a href="#" onClick={()=>this.getMeja()} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Tampilkan Semua</a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={()=>this.getMejaStatus("tersedia")} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Tersedia</a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={()=>this.getMejaStatus("tidak_tersedia")} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Tidak Tersedia</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <th scope="col" class="px-6 py-3">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.meja.map((item) => (
                                    <tr class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={item.id_meja}>
                                        <td class="px-6 py-4">
                                            {item.nomor_meja}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.status_meja}
                                        </td>
                                        <td class="px-6 py-4 text-center flex justify-evenly">
                                            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => this.Edit(item)}>Edit</a>
                                            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => this.dropMeja(item)}>Hapus</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Modal */}
                <div id="modal_meja" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex md:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.close()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Meja</h3>
                                <form class="space-y-6" onSubmit={(event) => this.saveMeja(event)}>
                                    <div>
                                        <label for="nomor_meja" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Meja</label>
                                        <input type="text" name="nomor_meja" id="nomor_meja" value={this.state.nomor_meja} onChange={this.bind} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Masukkan nomor meja" required />
                                    </div>
                                    <div className="hidden modal" aria-hidden="true" id="status">
                                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status Meja</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Status Meja" name="status_meja" value={this.state.status_meja} onChange={this.bind}>
                                            <option value="">Pilih Status Meja</option>
                                            <option value="tersedia">Tersedia</option>
                                            <option value="tidak_tersedia">Tidak Tersedia</option>
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