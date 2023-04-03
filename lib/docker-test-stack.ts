import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class DockerTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC},
      ],
    });

    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc: vpc,
      allowAllOutbound: true,
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    webserverSG.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(-1));


    const githubUrl = "https://github.com/SrinathBala/zap-flask.git";

    const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
      securityGroup: webserverSG,
      vpc: vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'devops',
      userData:  ec2.UserData.custom(`
      #!/bin/bash
      sudo -i
      yum update -y
      nyum install python3-pip git -y
      git clone ${githubUrl}
      pip3 install flask
      cd zap-flask
      python3 app.py
    `)
    });

  }
}
