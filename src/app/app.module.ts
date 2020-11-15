import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FeaturePeopleModule } from './feature-people/feature-people.module';
import { AppRoutingModule } from './app-routing.module';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        FeaturePeopleModule,
        AppRoutingModule,
        AkitaNgDevtools.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
}
