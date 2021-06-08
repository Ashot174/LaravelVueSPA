<template>
    <div>
        <Header />

        <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
            <transition name="slide" mode="out-in">
                <router-view></router-view>
            </transition>


                <Footer />

            </div>
        </div>

    </div>
</template>

<script>
    import Header from '../components/Header.vue';
    import Sidebar from '../components/Sidebar.vue';
    import Footer from '../components/Footer.vue';

    export default {
        name: "Home",
        components: {
            Header,
            Sidebar,
            Footer
        },
        created(){
            document.querySelector('body').style.backgroundColor = '#fff';
        },
    }
</script>

<style scoped>
    .slide-enter{

    }
    .slide-enter-active{
        animation: slideIn 0.5s;
    }
    .slide-enter-to{

    }
    .slide-leave{

    }
    .slide-leave-active{
        animation: slideOut 0.5s;
    }
    .slide-leave-to{

    }
    @keyframes slideIn {
        from{transform:rotateY(90deg)}
        to{transform:rotateY(0deg)}
    }

    @keyframes slideOut {
        from{transform:rotateY(0deg)}
        to{transform:rotateY(90deg)}
    }

</style>
