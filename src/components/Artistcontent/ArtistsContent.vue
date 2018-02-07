<template>
  <div>
    <ul class="clean-list">
      <li v-for="item in this.$store.getters['artists/cache']">
        <md-list-item to="/artists/1">
          <span class="md-list-item-text">{{item.Name}}</span>
        </md-list-item>
        <md-divider/>
      </li>

      <li>
        <md-list-item @click="loadMore" class="md-primary">
          <span key="__1" v-if="this.isLoading">
            <md-progress-spinner :md-diameter="20"
                                 :md-stroke="3"
                                 md-mode="indeterminate"/>
          </span>
          <span key="__2" v-else>
            Click to load more
          </span>
        </md-list-item>
      </li>

    </ul>
  </div>
</template>

<script src="./ArtistsContent.es6"></script>

<style scoped>
  @import './ArtistsContent.css';
</style>
