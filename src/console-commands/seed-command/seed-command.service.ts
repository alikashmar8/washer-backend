import { Injectable } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { UsersSeed } from 'src/seeds/user.seed';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';


@Injectable()
export class SeedCommandService {
  constructor(
    private readonly consoleService: ConsoleService,
    private dataSource: DataSource, // @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    // get the root cli
    const cli = this.consoleService.getCli();

    const runCommandGroup = this.consoleService.createGroupCommand(
      {
        command: 'run',
        description: 'A command to run function',
      },
      cli, // attach the command to the root cli
    );

    // seed command
    this.consoleService.createCommand(
      {
        command: 'seed [seed_name]',
        description: 'Seeding data',
      },
      this.runSeeder,
      runCommandGroup, // attach the command to the group
    );
  }

  runSeeder = async (seed_name?: string): Promise<void> => {
    const SEEDS_MAPPING = {
      users: UsersSeed,
      // shops: ShopsSeed,
      // posts: PostsSeed,
      // post_images: PostImageSeed,
      // products: ProductsSeed,
      // product_images: ProductImagesSeed,
    };

    for (let i = 0; i < SEEDS_MAPPING.users.length; i++) {
      SEEDS_MAPPING.users[i].password = await argon.hash('revojok12345');
    }

    if (seed_name) {
      const seed = SEEDS_MAPPING[seed_name];

      console.log(`seed: ${seed}`);
      if (!seed) {
        console.log(`Invalid seed name`);
        return;
      }

      console.log(`Seeding ${seed_name} ...`);
      try {
        await this.dataSource.getRepository(seed_name).save(seed);
        console.log('Seeding ' + seed_name + ' done.');
      } catch (e) {
        console.log('error seeding ' + seed_name + ': ' + e);
      }
    } else {
      console.log(`seed all`);

      for (const [key, value] of Object.entries(SEEDS_MAPPING)) {
        console.log(`Seeding ${key} ...`);
        try {
          // if (key == 'shops') {
          //   for (let i = 0; i < SEEDS_MAPPING.shops.length; i++) {
          //     const owner = await this.dataSource
          //       .getRepository('users')
          //       .createQueryBuilder()
          //       .orderBy('RAND()')
          //       .limit(1)
          //       .getOne();
          //     if (!owner) {
          //       console.log('error seeding shops: no owner found ');
          //       continue;
          //     }
          //     SEEDS_MAPPING.shops[i].owner = owner;
          //   }
          // }
          // if (key == 'posts') {
          //   for (let i = 0; i < SEEDS_MAPPING.posts.length; i++) {
          //     const user = await this.dataSource
          //       .getRepository('users')
          //       .createQueryBuilder()
          //       .orderBy('RAND()')
          //       .limit(1)
          //       .getOne();
          //     if (!user) {
          //       console.log('error seeding users: no owner found ');
          //       continue;
          //     }
          //     SEEDS_MAPPING.posts[i].user = user;
          //   }
          // }
          // if (key == 'post_images'){
          //   for (let i = 0; i < SEEDS_MAPPING.post_images.length; i++) {
          //     const post = await this.dataSource
          //       .getRepository('posts')
          //       .createQueryBuilder()
          //       .orderBy('RAND()')
          //       .limit(1)
          //       .getOne();
          //     if (!post) {
          //       console.log('error seeding post_image: no post found ');
          //       continue;
          //     }
          //     SEEDS_MAPPING.post_images[i].post = post;
          //   }
          // }
          // if (key == 'products') {
          //   for (let i = 0; i < SEEDS_MAPPING.products.length; i++) {
          //     const shop = await this.dataSource
          //       .getRepository('shops')
          //       .createQueryBuilder()
          //       .orderBy('RAND()')
          //       .limit(1)
          //       .getOne();
          //     if (!shop) {
          //       console.log('error seeding products: no shop found ');
          //       continue;
          //     }
          //     SEEDS_MAPPING.products[i].shop = shop;
          //   }
          // }
          // if (key == 'product_images') {
          //   for (let i = 0; i < SEEDS_MAPPING.product_images.length; i++) {
          //     const product = await this.dataSource
          //       .getRepository('products')
          //       .createQueryBuilder()
          //       .orderBy('RAND()')
          //       .limit(1)
          //       .getOne();
          //     if (!product) {
          //       console.log('error seeding product_image: no product found ');
          //       continue;
          //     }
          //     SEEDS_MAPPING.product_images[i].product = product;
          //   }
          // }

          const res: any = await this.dataSource.getRepository(key).save(value);
          console.log('Seeding ' + key + ' done.');
        } catch (e) {
          console.log('error seeding ' + key + ': ' + e);
        }
      }
    }
  };
}
