
import { Object3DNode } from '@react-three/fiber';
import { Light, Mesh, Group, SpotLight } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<Group, typeof Group>;
      mesh: Object3DNode<Mesh, typeof Mesh>;
      ambientLight: Object3DNode<Light, typeof Light>;
      spotLight: Object3DNode<SpotLight, typeof SpotLight>;
      pointLight: Object3DNode<Light, typeof Light>;
      sphereGeometry: any;
      boxGeometry: any;
      capsuleGeometry: any;
      meshStandardMaterial: any;
      meshPhongMaterial: any;
      meshBasicMaterial: any;
    }
  }
}
