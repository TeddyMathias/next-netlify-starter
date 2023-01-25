import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
    return ( <
        div className = "container" >
        <
        Head >
        <
        title > Next.js Starter! < /title> <
        link rel = "icon"
        href = "/favicon.ico" / >
        <
        /Head>

        <
        main >
        <
        Header title = "Coming soon!" / >
        <
        p className = "description" >
        In the meantime visit < a href: "www.teddymathias.com" > teddymathias.com < /a> < /
        p > <
        /main>

        // <
        // Footer / >
        <
        /div>
    )
}