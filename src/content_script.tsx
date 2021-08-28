interface Options {
  prefix: string
  separator: string
};

class PageTitleModifier {
  options: Options;
  originalTitle: string;
  lastTitleSetByAddon: boolean = false;
  titleObserver:MutationObserver;

  constructor() {
    this.originalTitle = '' + document.title;
    chrome.storage.sync.get(
      {
        prefix: "SET PREFIX",
        separator: "-"
      },
      this.updateOptions.bind(this)
    );
    this.observeTitleChanges();
  }

  private updateOptions(options:Options) {
    this.options = options;
    this.setTitle(/*useOriginalTitle*/true);
  }

  private setTitle(useOriginalTitle:boolean) {
    this.lastTitleSetByAddon = true;
    if(useOriginalTitle) {
      document.title = this.titleFormatter(this.originalTitle);
    } else if(document.title.indexOf(this.options.prefix) < 0) {
      document.title = this.titleFormatter(document.title);
    }
  }

  private titleFormatter(title:string) {
    let newTitle = [this.options.prefix, this.options.separator,title].join(' ');
    return newTitle;
  }

  private observeTitleChanges() {
    const self = this;
    this.titleObserver = new MutationObserver(function(mutations:MutationRecord[]) {
      mutations.forEach(function(mutation:MutationRecord) {
        if(self.lastTitleSetByAddon == false) {
          self.setTitle(/*useOriginalTitle*/false);
        }
        self.lastTitleSetByAddon = false;
      });
    });

    const target = document.querySelector('head > title');

    if(target) {
      this.titleObserver.observe(
        target,
        {
          attributes: true,
          childList: true,
          characterData: true
      });
    }
  }
}

const modifier = new PageTitleModifier();
