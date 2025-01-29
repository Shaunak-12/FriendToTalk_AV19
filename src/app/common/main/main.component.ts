import { HeaderComponent } from './header/header.component';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';


import {AppState} from '@/store/state';
import {ToggleSidebarMenu,ToggleDarkMode} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent,MenuSidebarComponent,FooterComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  @HostBinding('class') class = 'wrapper';
  public ui: Observable<UiState> | undefined;
  constructor(private renderer: Renderer2, private store: Store<AppState>) {}
  
  ngOnInit() {
    this.ui = this.store.select('ui');
    this.renderer.removeClass(document.querySelector('app-root'),'login-page');
    this.renderer.removeClass(document.querySelector('app-root'),'register-page');
    this.renderer.addClass(document.querySelector('app-root'),'layout-fixed');
    
    // ORG CODE
    // this.ui.subscribe(({menuSidebarCollapsed, controlSidebarCollapsed, darkMode}) => {
    //     if (menuSidebarCollapsed) {
    //       this.renderer.removeClass(document.querySelector('app-root'),'sidebar-open');
    //       this.renderer.addClass(document.querySelector('app-root'),'sidebar-collapse');
    //     } else {
    //       this.renderer.removeClass(document.querySelector('app-root'),'sidebar-collapse');
    //       this.renderer.addClass(document.querySelector('app-root'),'sidebar-open');
    //     }
        
    //     if (controlSidebarCollapsed) {
    //       this.renderer.removeClass(document.querySelector('app-root'),'control-sidebar-slide-open');
    //     } else {
    //       this.renderer.addClass(document.querySelector('app-root'),'control-sidebar-slide-open');
    //     }
        
    //     if (darkMode) {
    //       this.renderer.addClass(document.querySelector('app-root'),'dark-mode');
    //     } else {
    //       this.renderer.removeClass(document.querySelector('app-root'),'dark-mode');
    //     }
    //   }
    //   );
    // }

    // added by shaunak
    this.ui.subscribe((data) => {
      if (!data) return; 
      
      const { menuSidebarCollapsed, controlSidebarCollapsed, darkMode } = data;
    
      if (menuSidebarCollapsed) {
        this.renderer.removeClass(document.querySelector('app-root'), 'sidebar-open');
        this.renderer.addClass(document.querySelector('app-root'), 'sidebar-collapse');
      } else {
        this.renderer.removeClass(document.querySelector('app-root'), 'sidebar-collapse');
        this.renderer.addClass(document.querySelector('app-root'), 'sidebar-open');
      }
    
      if (controlSidebarCollapsed) {
        this.renderer.removeClass(document.querySelector('app-root'), 'control-sidebar-slide-open');
      } else {
        this.renderer.addClass(document.querySelector('app-root'), 'control-sidebar-slide-open');
      }
    
      if (darkMode) {
        this.renderer.addClass(document.querySelector('app-root'), 'dark-mode');
      } else {
        this.renderer.removeClass(document.querySelector('app-root'), 'dark-mode');
      }
    });
  }    
    
    onToggleMenuSidebar() {
      this.store.dispatch(new ToggleSidebarMenu());
    }
  }
