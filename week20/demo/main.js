import { createElement } from './createElement.js';
//import {Carousel} from './carousel.vue'
import { Carousel } from './components/Carousel.js';
import { Panel } from './components/Panel.js';
import { TabPanel } from './components/TabPanel.js';
import { ListView } from './components/ListView.js';

let data = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
];
let component = <Carousel data={data}></Carousel>;
component.mountTo(document.body);

// let panel = (
//   <Panel title={65'title'}>
//     <span>myContent</span>
//   </Panel>
// );
// panel.mountTo(document.body);

// let tabpanel = (
//   <TabPanel>
//     <span title="title1">content1</span>
//     <span title="title2">content2</span>
//     <span title="title3">content3</span>
//     <span title="title4">content4</span>
//   </TabPanel>
// );
// tabpanel.mountTo(document.body);

// let listData = [
//   {
//     title: '蓝猫',
//     url:
//       'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg'
//   },
//   {
//     title: '橘猫加白',
//     url:
//       'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg'
//   },
//   {
//     title: '狸花加白',
//     url:
//       'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg'
//   },
//   {
//     title: '橘猫',
//     url:
//       'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
//   }
// ];
// let list = (
//   <ListView data={listData}>
//     {(record) => (
//       <figure style="width:100%">
//         <img style="width:100%" src={record.url} />
//         <figcaption>{record.title}</figcaption>
//       </figure>
//     )}
//   </ListView>
// );
// list.mountTo(document.body);
