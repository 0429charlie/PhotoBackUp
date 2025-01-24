import { App, Stack, StackProps } from 'aws-cdk-lib'
import { CfnSubnet, CfnVPC } from 'aws-cdk-lib/aws-ec2'

export class VPCStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpcCIDRs = { vpc: '192.168.0.0/16' }
    const subnetCIDR = { public: '192.168.0.0/24', private: '192.168.1.0/24' }

    // --context profile=xxx が指定されてなかったらデフォルト値 dev にする
    const profileStr = this.node.tryGetContext('profile') ?? 'dev'
    // xxx もしくはdevとかで cdk.json から設定をとる
    const profile = this.node.tryGetContext(profileStr)
    console.log(profile.name) // stagingとかがとれる

    const vpc = new CfnVPC(this, 'MyVPC', {
      cidrBlock: vpcCIDRs.vpc,
      tags: [{ key: 'Name', value: `${profile.name}-vpc` }],
    })

    new CfnSubnet(this, `MyPublicSubnet`, {
      vpcId: vpc.ref,
      cidrBlock: subnetCIDR.public,
      availabilityZone: 'ap-northeast-1',
      mapPublicIpOnLaunch: true,
      tags: [{ key: 'Name', value: `public-subnet` }],
    })

    new CfnSubnet(this, `MyPrivateSubnet`, {
      vpcId: vpc.ref,
      cidrBlock: subnetCIDR.private,
      availabilityZone: 'ap-northeast-1',
      mapPublicIpOnLaunch: false,
      tags: [{ key: 'Name', value: `private-subnet` }],
    })
  }
}


// export class VPCStack extends Stack {
//   public readonly vpc: CfnVPC // プロパティを準備
//
//   constructor(scope: App, id: string, props?: StackProps) {
//     super(scope, id, props)
//
//     const vpcCIDRs = { vpc: '192.168.0.0/16' }
//
//     // --context profile=xxx が指定されてなかったらデフォルト値 dev にする
//     const profileStr = this.node.tryGetContext('profile') ?? 'dev'
//     // xxx もしくはdevとかで cdk.json から設定をとる
//     const profile = this.node.tryGetContext(profileStr)
//     console.log(profile.name) // stagingとかがとれる
//
//     // VPC
//     const vpc = new CfnVPC(this, 'MyVPC', {
//       cidrBlock: vpcCIDRs.vpc,
//       tags: [{ key: 'Name', value: `${profile.name}-test-vpc`}],
//     })
//     this.vpc = vpc // 作ったインスタンスをプロパティに保持
//   }
// }


