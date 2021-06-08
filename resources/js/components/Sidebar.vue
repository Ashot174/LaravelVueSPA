<template>
    <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav">
                    <router-link :to="{name: 'dashboard'}" class="nav-link">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </router-link>

                    <router-link :to="{name: 'categories'}"
                                 class="nav-link"
                                 v-if="$store.state.profile.role ==='administrator'">
                        <i class="fas fa-columns"></i>
                        <span>Categories</span>
                    </router-link>

                    <router-link :to="{name: 'products'}"
                                 class="nav-link"
                                 v-if="$store.state.profile.role ==='user'">
                        <i class="fas fa-fw fa-chart-area"></i>
                        <span>Products</span>
                    </router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "Sidebar"
    }
</script>

<style scoped>

</style>
