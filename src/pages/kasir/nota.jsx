import React from "react";
import Chart from "react-apexcharts";
import Navbar from "./navbar";
import axios from "axios";
import $ from 'jquery';
import 'flowbite-datepicker';

export default class Manajer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            nama_user: "",
            data: [],
            total: 0,
            // pendapatan: 0,
            transaksi: [],
            detail_transaksi: [],
            detail: [],
            awal: "",
            akhir: "",
            options: {
                chart: {
                    id: "basic-bar",
                },
                xaxis: {
                    categories: [],
                },
            },
        };
        let user = JSON.parse(localStorage.getItem('user'))
        if (localStorage.getItem("token") && user.role === "manajer") {
            this.state.token = localStorage.getItem("token")
        } else {
            window.alert("Maaf, anda bukan manajer")
            window.location = "/"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }

    getTransaksiUser = (event) => {
        event.preventDefault()
        let url = "http://localhost:4040/kasir_kafe/pemesanan/user/" + this.state.nama_user
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
    getTransaksi = () => {
        let url = "http://localhost:4040/kasir_kafe/pemesanan/"
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
    getTransaksiTanggal = (event) => {
        event.preventDefault()
        let url = `http://localhost:4040/kasir_kafe/pemesanan/tanggal/${this.timeAwal(this.state.awal)}/${this.timeAkhir(this.state.akhir)}`
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
    getDetail = (selectedItem) => {
        $("#modal_detail").show()
        axios.get("http://localhost:4040/kasir_kafe/pemesanan/detail/" + selectedItem.id_transaksi, this.headerConfig())
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
        console.log(this.state.awal)
    }
    getDetailTransaksi = () => {
        axios.get("http://localhost:4040/kasir_kafe/pemesanan/detail/", this.headerConfig())
            .then(response => {
                this.setState({ detail: response.data.data })
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
    timeAwal = time => {
        let date = new Date(time)
        return `${date.getFullYear()}-${Number(date.getMonth()) + 1}-${date.getDate()}`
    }
    timeAkhir = time => {
        let date = new Date(time)
        return `${date.getFullYear()}-${Number(date.getMonth()) + 1}-${date.getDate() + 1}`
    }

    convertTime = time => {
        let date = new Date(time)
        return `${date.getDate()}/${Number(date.getMonth()) + 1}/${date.getFullYear()}`
    }
    close = () => {
        $("#modal_detail").hide()
        this.state.total = 0
    }

    componentDidMount() {
        this.getTransaksi()
        // this.getDetailTransaksi()
        axios
            .get("http://localhost:4040/kasir_kafe/pemesanan/qtybymenu", this.headerConfig())
            .then((response) => {
                const categories = response.data.map((data) => data.nama_menu);
                const values = response.data.map((data) => data.total_qty);

                this.setState({
                    data: [
                        {
                            name: "Value",
                            data: values,
                        },
                    ],
                    options: {
                        chart: {
                            id: "basic-bar",
                        },
                        xaxis: {
                            categories: categories,
                            labels: {
                                style: {
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "18px",
                                },
                            },
                        },
                    },
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // bind = (event) => {
    //     this.setState({ [event.target.name]: event.target.value })
    // }
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

    // totalBayar = () => {
    //     for (let i = 0; i < this.state.detail_transaksi.length; i++) {
    //         var harga = this.state.detail_transaksi[i].menu.harga
    //         var qty = this.state.detail_transaksi[i].qty
    //         var subTotal = harga * qty
    //         this.state.total = this.state.total + subTotal
    //     }
    //     let totalBayar = this.state.total
    //     return totalBayar
    // }
    // pendapatan = () => {
    //   for (let i = 0; i < this.state.detail.length; i++) {
    //     var harga = this.state.detail[i].menu.harga
    //     var qty = this.state.detail[i].qty
    //     var subTotal = harga * qty
    //     this.state.pendapatan = this.state.pendapatan + subTotal
    //   }
    //   console.log(this.state.pendapatan)
    //   console.log(this.state.detail)
    //   return this.state.pendapatan
    // }

    getNomorMeja = (value) => {
        if (value.id_meja !== null) {
            return value.meja.nomor_meja
        } else {
            return "tidak ada"
        }

    }

    render() {
        return (
            <div className='flex h-screen w-full'>
                <div class="w-full h-screen">
                    <div class="relative overflow-x-auto shadow-md p-4 sm:rounded-lg m-2">
                        <h2 className="dark:text-white text-lg font-sans mb-2">Grafik Menu Terlaris
                        </h2>
                        <div class="p-4 mb-6 border-2 border-gray-200 border-dashed sm:rounded-lg dark:border-gray-700">
                            <Chart
                                options={this.state.options}
                                series={this.state.data}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                    <hr></hr>
                    <div class="relative shadow-md sm:rounded-lg m-2">
                        <div className="flex justify-between items-center m-4">
                            <h2 className="dark:text-white text-lg font-sans">Riwayat Penjualan</h2>
                        </div>
                        {/* <p className="font-sans text-gray-700">Total Pendapatan: {this.convertToRupiah(this.pendapatan())}</p> */}
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Nama Pelanggan
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Nomor Meja
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Petugas
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Tanggal Pemesanan
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Jenis Pesanan
                                    </th>
                                    <th scope="col" class="px-6 py-3 ">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.transaksi.map(item => (
                                    <tr class="bg-white border-b font-sans dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={() => this.getDetail(item)} key={item.id_transaksi}>
                                        <td class="px-6 py-4">
                                            {item.nama_pelanggan}
                                        </td>
                                        <td class="px-6 py-4">
                                            {this.getNomorMeja(item)}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.user.nama_user}
                                        </td>
                                        <td class="px-6 py-4">
                                            {this.convertTime(item.tgl_transaksi)}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.jenis_pesanan}
                                        </td>
                                        <td class="px-6 py-4">
                                            {item.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}