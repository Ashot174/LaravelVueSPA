<template>
    <div class="container-fluid">
        <h1 class="mt-4">Dashboard</h1>
        <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item active">
                <router-link to="/home">Dashboard</router-link>
            </li>
        </ol>
        <div class="row">
            <div class="col-xl-12">
                <div class="card mb-4">
                    <div class="card-header d-flex">
                        <span>
                            <i class="fas fa-chart-area mr-1"></i>
                            Categories Management
                        </span>
                        <button class="btn btn-primary btn-sm ml-auto" v-on:click="showNewCategoryModal">
                            <span class="fa fa-plus"></span>
                            Create new category
                        </button>
                    </div>
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(category, index) in categories" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{category.name}}</td>
                                <td>
                                    <img :src="`${$store.state.serverPath}/storage/${category.image}`" alt="" class="w-150px">
                                </td>
                                <td>
                                    <button class="btn btn-primary" v-on:click="editCategory(category)">+</button>
                                    <button class="btn btn-danger" v-on:click="deleteCategory(category)">-</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="text-center" v-show="moreExists">
                            <button type="button" class="btn btn-primary" v-on:click="loadMore">Load more</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-modal ref="newCategoryModal" hide-footer title="Add new category">
            <div class="d-block">
                <form v-on:submit.prevent="createCategory">
                    <div class="form-group">
                        <label for="name">Enter Name</label>
                        <input type="text" v-model="categoryData.name" class="form-control" id="name" placeholder="Enter category name">
                        <div class="invalid-feedback" v-if="errors.name">{{errors.name[0]}}</div>
                    </div>
                    <div class="form-group">
                        <label for="image">Choose an image</label>
                        <div v-if="categoryData.image.name">
                            <img src="" ref="newCategoryImageDisplay" class="w-150px">
                        </div>
                        <input type="file" v-on:change="attachImage" ref="newCategoryImage" class="form-control" id="image" placeholder="Enter category name">
                        <div class="invalid-feedback" v-if="errors.image">{{errors.image[0]}}</div>
                    </div>

                    <hr>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <button type="button" class="btn btn-default" v-on:click="hideNewCategoryModal">Cancel</button>
                    </div>

                </form>
            </div>
        </b-modal>

        <b-modal ref="editCategoryModal" hide-footer title="Edit the category">
            <div class="d-block">
                <form v-on:submit.prevent="updateCategory">
                    <div class="form-group">
                        <label for="nameEdit">Enter Name</label>
                        <input type="text" v-model="editCategoryData.name" class="form-control" id="nameEdit" placeholder="Enter category name">
                        <div class="invalid-feedback" v-if="errors.name">{{errors.name[0]}}</div>
                    </div>
                    <div class="form-group">
                        <label for="imageEdit">Choose an image</label>
                        <div>
                            <img :src="`${$store.state.serverPath}/storage/${editCategoryData.image}`" ref="editCategoryImageDisplay" class="w-150px">
                        </div>
                        <input type="file" v-on:change="editAttachImage" ref="editCategoryImage" class="form-control" id="imageEdit" placeholder="Enter category name">
                        <div class="invalid-feedback" v-if="errors.image">{{errors.image[0]}}</div>
                    </div>

                    <hr>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">Update</button>
                        <button type="button" class="btn btn-default" v-on:click="hideEditCategoryModal">Cancel</button>
                    </div>

                </form>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import * as categoryService from '../services/category_service';

    export default {
        name: "Categories",
        data(){
            return{
                categories: [],
                categoryData: {
                    name: '',
                    image: ''
                },
                moreExists: false,
                nextPage: 0,
                editCategoryData: {},
                errors: {}
            }
        },
        mounted(){
            this.loadCategories();
        },
        methods:{
            loadCategories: async function(){
                try{
                    const response = await categoryService.loadCategories();
                    this.categories = response.data.data;
                   if(response.data.current_page < response.data.last_page){
                       this.moreExists = true;
                       this.nextPage = response.data.current_page + 1;
                   }else{
                       this.moreExists = false;
                   }
                }catch (e) {
                    this.flashMessage.error({
                        message: 'Some error occurred, please refresh!',
                        time: 5000
                    });
                }
            },
            attachImage(){
                this.categoryData.image = this.$refs.newCategoryImage.files[0];
                let reader = new FileReader();
                reader.addEventListener('load',function () {
                    this.$refs.newCategoryImageDisplay.src = reader.result;
                }.bind(this), false);

                reader.readAsDataURL(this.categoryData.image);
            },
            createCategory: async function(){
                let formData = new FormData();
                formData.append('name', this.categoryData.name);
                formData.append('image', this.categoryData.image);
                try {
                    const response = await categoryService.createCategory(formData);
                    this.categories.unshift(response.data);
                    this.hideNewCategoryModal();
                    this.flashMessage.success({
                        title: 'Success Message Title',
                        message: 'Category stored successfully!',
                        time: 5000
                    });
                    this.categoryData =  {
                            name: '',
                            image: ''
                    };

                }catch (error) {
                    switch (error.response.status) {
                        case 422:
                            this.errors = error.response.data.errors;
                            break;
                        default:
                            this.flashMessage.error({
                                title: 'Error Message Title',
                                message: 'Some error occurred, please try again!',
                                time:5000
                            });
                            break;
                    }
                }
            }
                ,
            hideNewCategoryModal(){
                this.$refs.newCategoryModal.hide();
            },
            showNewCategoryModal(){
                this.$refs.newCategoryModal.show();
            },
            deleteCategory: async function(category){
                if(!window.confirm(`Are you sure you want to delete ${category.name}`)){
                    return;
                }
                try {
                    await categoryService.deleteCategory(category.id);
                    this.categories = this.categories.filter(obj =>{
                        return obj.id !== category.id;
                    });
                    this.flashMessage.success({
                        message: 'Category deleted successfully!',
                        time: 5000
                    });
                }catch (e) {
                    this.flashMessage.error({
                        message: e.response.data.message,
                        time:5000
                    });
                }
            },
            hideEditCategoryModal(){
                this.$refs.editCategoryModal.hide();
            },
            showEditCategoryModal(){
                this.$refs.editCategoryModal.show();
            },
            editCategory(category){
                this.editCategoryData = {...category};
                this.showEditCategoryModal();
            },
            editAttachImage(){
                this.editCategoryData.image = this.$refs.editCategoryImage.files[0];
                let reader = new FileReader();
                reader.addEventListener('load',function () {
                    this.$refs.editCategoryImageDisplay.src = reader.result;
                }.bind(this), false);

                reader.readAsDataURL(this.editCategoryData.image);
            },
            updateCategory: async function(){
                try {
                    const formData = new FormData();
                    formData.append('name', this.editCategoryData.name);
                    formData.append('image', this.editCategoryData.image);
                    formData.append('_method', 'put');

                    const response = await categoryService.updateCategory(this.editCategoryData.id, formData);
                    this.categories.map(category =>{
                        if(category.id == response.data.id){
                            for (let key in response.data){
                                category[key] = response.data[key];
                            }
                        }
                    });

                    this.hideEditCategoryModal();

                    this.flashMessage.success({
                        message: 'Category updated successfully!',
                        time: 5000
                    });
                }catch (error) {
                    this.flashMessage.error({
                        message: error.response.data.message,
                        time:5000
                    });
                }
            },
            loadMore: async function(){
                try {
                    const response = await categoryService.loadMore(this.nextPage);
                    if(response.data.current_page < response.data.last_page){
                        this.moreExists = true;
                        this.nextPage = response.data.current_page + 1;
                    }else{
                        this.moreExists = false;
                    }
                    response.data.data.forEach(data => {
                        this.categories.push(data)
                    });
                }catch (error) {
                    this.flashMessage.error({
                        message: 'Some error occurred during loading more categories',
                        time:5000
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
