<template>
    <div>
        <h3>{{pos}}</h3>
        <h3>{{name}}</h3>
        <button v-on:click = "show()">Show</button>
    </div>
    <div v-if = "show">
        {{player}}
    </div>
</template>

<script>

export default defineComponent({
    name: "Player",
    props: {
        pos: Number,
        name: String
    },
    data() {
        show = false
    },
    methods: {
        show(){
            this.show = !this.show
        }
    }
})
</script>
